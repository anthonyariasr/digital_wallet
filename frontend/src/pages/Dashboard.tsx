import React, { useEffect, useState } from 'react';
import { DollarSign, Package, Star } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate

interface DashboardCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string;
}

interface Order {
  order_id: number;
  client_id: number;
  total: number;
  products: { product_id: number; name: string; quantity: number; subtotal: number }[];
}

interface ProductSales {
  product_id: number;
  name: string;
  totalSold: number;
}

const Dashboard: React.FC = () => {
  const [totalSales, setTotalSales] = useState<string>('0');
  const [totalOrders, setTotalOrders] = useState<string>('0');
  const [bestSellingProduct, setBestSellingProduct] = useState<string>('N/A');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate(); // Usar el hook useNavigate

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Llamada al backend para obtener las órdenes
        const response = await axios.get<{ orders: Order[] }>('http://127.0.0.1:8000/orders');
        
        const orders = response.data.orders;

        // Calcular las ventas del día (suma de los totales de todas las órdenes)
        const totalSalesToday = orders.reduce((acc, order) => acc + order.total, 0);

        // Calcular la cantidad total de órdenes
        const totalOrdersCount = orders.length;

        // Crear un mapa para contar las ventas por producto
        const productSales: { [key: number]: ProductSales } = {};

        orders.forEach(order => {
          order.products.forEach(product => {
            if (!productSales[product.product_id]) {
              productSales[product.product_id] = {
                product_id: product.product_id,
                name: product.name,
                totalSold: 0,
              };
            }
            productSales[product.product_id].totalSold += product.quantity;
          });
        });

        // Encontrar el producto más vendido
        const bestSelling = Object.values(productSales).reduce((max, product) =>
          product.totalSold > max.totalSold ? product : max,
        );

        // Actualizar el estado con los datos obtenidos
        setTotalSales(`$${totalSalesToday.toFixed(2)}`);
        setTotalOrders(totalOrdersCount.toString());
        setBestSellingProduct(bestSelling.name);
        setIsLoading(false);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="p-6">Cargando datos del dashboard...</div>;
  }

  // Funciones para redirigir a las páginas correspondientes
  const handleCreateOrder = () => {
    navigate('/orders'); // Redirigir a la página de crear orden
  };

  const handleProcessRecharge = () => {
    navigate('/recharges'); // Redirigir a la página de procesar recarga
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard icon={DollarSign} title="Ventas del día" value={totalSales} />
        <DashboardCard icon={Package} title="Cantidad de órdenes" value={totalOrders} />
        <DashboardCard icon={Star} title="Artículo más vendido" value={bestSellingProduct} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={handleCreateOrder}
          className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Crear nueva orden
        </button>
        <button
          onClick={handleProcessRecharge}
          className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Procesar recarga
        </button>
      </div>
      <footer className="mt-12 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Desarrollado por Anthony Arias, Luis Méndez y Roosevelt Pérez
      </footer>
    </div>
  );
};

const DashboardCard: React.FC<DashboardCardProps> = ({ icon: Icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Icon className="h-8 w-8 text-gray-500" />
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;

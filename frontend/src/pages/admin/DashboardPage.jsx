import formatCurrency from "../../utils/formatCurrency";

const stats = [
  { label: "Tổng doanh thu", value: 125000000, isCurrency: true },
  { label: "Tổng đơn hàng", value: 348, isCurrency: false },
];

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl px-6 py-5"
          >
            <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
            <p className="text-2xl font-medium text-gray-900">
              {stat.isCurrency ? formatCurrency(stat.value) : stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
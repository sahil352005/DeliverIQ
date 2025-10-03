import AnalyticsCards from '../../components/AnalyticsCards';
import AnalyticsChart from '../../components/AnalyticsChart';

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto mt-12">
      <AnalyticsCards />
      <AnalyticsChart />
    </div>
  );
}
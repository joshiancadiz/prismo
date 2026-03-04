import DashboardPage from './dashboard/page';

export default function Home(props: { params: Promise<{}> }) {
  return (
    <div className="bg-white rounded-[10px] flex-1 p-8 overflow-y-auto">
      <DashboardPage />
    </div>
  );
}

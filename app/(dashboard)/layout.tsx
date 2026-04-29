import VerticalNavbar from '@/components/common/VerticalNavbar';
import Chatbot from '@/components/chatbot/Chatbot';
import ThreeBackground from '@/components/ui/ThreeBackground';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <ThreeBackground variant="stars" />
            <VerticalNavbar />
            <main className="flex-1 ml-20 p-6 relative z-10 bg-black/20 backdrop-blur-sm">
                {children}
            </main>
            <Chatbot />
        </div>
    );
}
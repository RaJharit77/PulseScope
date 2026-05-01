import VerticalNavbar from '@/components/common/VerticalNavbar';
import Chatbot from '@/components/chatbot/Chatbot';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <VerticalNavbar />
            <main className="flex-1 w-full relative z-10 pt-16 md:pt-0">
                {children}
            </main>
            <Chatbot />
        </div>
    );
}
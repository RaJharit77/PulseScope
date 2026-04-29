import ThreeBackground from "@/components/ui/ThreeBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen relative">
            <ThreeBackground variant="waves" primaryColor="#FF3366" secondaryColor="#6C63FF" />
            <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-0" />
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                {children}
            </div>
        </div>
    );
}
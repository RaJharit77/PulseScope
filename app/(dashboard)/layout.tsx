import ThreeBackground from '@/components/ui/ThreeBackground';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThreeBackground variant="stars" />
            {children}
        </>
    );
}
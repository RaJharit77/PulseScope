import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300">
            <AlertCircle className="w-5 h-5" />
            <span>{message}</span>
        </div>
    );
}
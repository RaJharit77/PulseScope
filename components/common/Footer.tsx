export default function Footer() {
    return (
        <footer className="border-t border-white/10 py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} PulseScope. Tous droits réservés.
            </div>
        </footer>
    );
}
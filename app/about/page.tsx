import Link from 'next/link';
import {
    ArrowRight,
    TrendingUp,
    BarChart3,
    Music,
    Podcast,
    Search,
    ShieldCheck
} from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r  from-primary to-secondary bg-clip-text text-transparent">
                    À propos de PulseScope
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Une plateforme née de la passion pour les données et les médias, conçue pour vous aider à comprendre ce qui
                    captive le monde aujourd’hui.
                </p>
            </div>

            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Notre mission
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    Dans un univers numérique saturé d’informations, PulseScope agit comme un phare. Nous agrégeons en temps réel
                    les signaux faibles et les tendances fortes issues de YouTube, Spotify, et des podcasts (via Taddy). Que vous
                    soyez créateur de contenu, marketeur, analyste ou simplement curieux, notre mission est de vous donner une
                    longueur d’avance dans la compréhension des sujets émergents.
                </p>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-secondary" />
                    Fonctionnalités clés
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <FeatureCard
                        icon={<Search className="w-6 h-6 text-primary" />}
                        title="Recherche multi‑source"
                        description="Un simple mot‑clé vous ouvre les portes de YouTube, Spotify et des podcasts. Comparez les résultats en un clin d’œil."
                    />
                    <FeatureCard
                        icon={<Music className="w-6 h-6 text-amber-400" />}
                        title="Analyse musicale"
                        description="Visualisez la popularité des titres sur Spotify, écoutez des extraits et découvrez les artistes associés."
                    />
                    <FeatureCard
                        icon={<Podcast className="w-6 h-6 text-purple-400" />}
                        title="Exploration de podcasts"
                        description="Parcourez les épisodes les plus pertinents, lisez les descriptions et lancez l’écoute directement."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                        title="Courbes de popularité"
                        description="Suivez l’évolution de l’intérêt pour un sujet sur 30 jours grâce à nos graphiques interactifs."
                    />
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    Comment ça marche ?
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                    PulseScope s’appuie sur les API officielles de YouTube, Spotify et Taddy. Lorsque vous effectuez une recherche,
                    nous interrogeons ces services en parallèle et affichons les résultats de manière unifiée. Aucune donnée
                    personnelle n’est collectée sans votre consentement. Vous pouvez utiliser la plateforme sans compte, mais la
                    création d’un compte gratuit vous donne accès à des fonctionnalités avancées comme la sauvegarde de vos
                    recherches et un dashboard personnalisé.
                </p>
                <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition font-medium"
                >
                    Créer un compte gratuit <ArrowRight className="w-4 h-4" />
                </Link>
            </section>

            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-semibold mb-2">Prêt à explorer les tendances ?</h2>
                <p className="text-gray-400 mb-6">
                    Lancez‑vous dès maintenant et découvrez ce qui fait vibrer le monde.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/demo"
                        className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition"
                    >
                        Essayer la démo
                    </Link>
                    <Link
                        href="/test"
                        className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition"
                    >
                        Tester les APIs
                    </Link>
                </div>
            </div>
        </div>
    );
}


function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-primary/50 transition">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
                <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

import Link from "next/link"
import { Button } from "../ui/button"
import { CanvasMock } from "./canvas-mock"
import { Github, Sparkles, Palette, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const ContentPage=()=>{
    return(
        <section className="relative">
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32 lg:py-40 grid lg:grid-cols-2 items-center gap-16">
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200/50 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 " />
                <span className="text-sm font-medium text-neutral-500">Creative Collaboration Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight">
                <span className="bg-gradient-to-r from-neutral-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  PrismArt
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-600 mt-2 block">
                  where Ideas come to Life
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl leading-relaxed text-neutral-600 max-w-2xl mx-auto lg:mx-0">
                Transform your thoughts into visual masterpieces. Create, collaborate, and bring your wildest ideas to life with our intuitive drawing platform designed for creators, teams, and dreamers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href={"/login"} className="group">
                 <Button >
                   <Palette className="w-5 h-5 mr-3" />
                   Start Creating
                 </Button>
                </Link>
                <Link href={"https://github.com/isuzwal/sword-draw"} className="group">
                <Button variant="outline">
                  <Github className="w-5 h-5 mr-3" />
                  <span className="font-medium">Star on GitHub</span>
                </Button>
                </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-neutral-200/50  bg-white/80 backdrop-blur-sm">
                <div className="relative">
                  <CanvasMock />
                </div>
              </div>
            </div>
          </div>
        </div>

      
        <section id="features" className="relative w-full py-20 md:py-28 bg-neutral-50/50">
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                <Users className="w-4 h-4" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                Everything You Need to Create
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                From real-time collaboration to infinite canvas space, we've built the perfect toolkit for modern creators.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                title="Real-time Collaboration"
                description="Invite teammates and see cursors, edits, and comments live as they happen."
                icon={<CursorIcon />}
              />
              <FeatureCard
                title="Infinite Canvas"
                description="Boundless space for brainstorming, mapping, and planning without limits."
                icon={<GridIcon />}
              />
              <FeatureCard
                title="Hand‑drawn Feel"
                description="Organic strokes and subtle jitter that feel natural and expressive."
                icon={<PencilIcon />}
              />
              <FeatureCard
                title="Instant Sharing"
                description="Share a link or export snapshots in seconds with one click."
                icon={<ShareIcon />}
              />
            </div>
          </div>
        </section>
      </section>
    )
}

function FeatureCard({
    title,
    description,
    icon,
  }: {
    title: string
    description: string
    icon: React.ReactNode
  }) {
    return (
      <Card className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-neutral-50/50 dark:bg-neutral-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative flex-row items-start gap-4 pb-3">
          <div className="size-12 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
            <span className="sr-only">{title} icon</span>
            <div className="text-neutral-600 dark:text-neutral-300">{icon}</div>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-300">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {description}
        </CardContent>
      </Card>
    )
  }

  /* Modern colorful icons */
function CursorIcon() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="Collaboration" className="drop-shadow-sm">
        <path d="M4 3l14 7-6 2-2 6-6-15z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="18" cy="10" r="2" fill="currentColor" />
      </svg>
    )
  }
  function GridIcon() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="Infinite Canvas" className="drop-shadow-sm">
        <path
          d="M3 9h18M3 15h18M9 3v18M15 3v18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    )
  }
  function PencilIcon() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="Hand-drawn Feel" className="drop-shadow-sm">
        <path
          d="M3 21l3-1 11-11-2-2L4 18l-1 3zM14 4l2 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M17 7l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  function ShareIcon() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="Instant Sharing" className="drop-shadow-sm">
        <path
          d="M4 12v6a2 2 0 0 0 2 2h12M16 6l-4-4-4 4M12 2v14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    )
  }
  
import { MessageCircle, Clock, MapPin } from "lucide-react"
import { getSiteSettings, type ScheduleEntry } from "@/lib/data/site-settings"

export async function ContactInfo() {
  const settings = await getSiteSettings()
  const schedule = Array.isArray(settings.schedule) ? (settings.schedule as unknown as ScheduleEntry[]) : []

  return (
    <section className="py-24 bg-zinc-950 border-t border-zinc-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* WhatsApp */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 flex flex-col items-start gap-4 hover:border-green-600/50 transition-colors group">
            <div className="w-14 h-14 bg-green-600/20 rounded-xl flex items-center justify-center border border-green-600/30 group-hover:bg-green-600/30 transition-colors">
              <MessageCircle className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg mb-1">WhatsApp Directo</h3>
              <p className="text-zinc-400 text-sm mb-4">Respuesta en menos de 15 minutos en horario de bar</p>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Abrir Chat
              </a>
            </div>
          </div>

          {/* Horarios */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 hover:border-accent-primary/30 transition-colors group">
            <div className="w-14 h-14 bg-accent-primary/20 rounded-xl flex items-center justify-center border border-accent-primary/30 mb-4 group-hover:bg-accent-primary/30 transition-colors">
              <Clock className="w-7 h-7 text-accent-primary" />
            </div>
            <h3 className="text-white font-black text-lg mb-4">Horarios</h3>
            <div className="space-y-3">
              {schedule.map((s) => (
                <div key={s.day} className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{s.day}</span>
                  <span className="text-white font-bold">{s.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 hover:border-accent-primary/30 transition-colors group">
            <div className="w-14 h-14 bg-accent-primary/20 rounded-xl flex items-center justify-center border border-accent-primary/30 mb-4 group-hover:bg-accent-primary/30 transition-colors">
              <MapPin className="w-7 h-7 text-accent-primary" />
            </div>
            <h3 className="text-white font-black text-lg mb-2">Ubicación</h3>
            <p className="text-zinc-400 text-sm mb-4">{settings.address}</p>
            <div className="rounded-xl overflow-hidden border border-zinc-700 h-36">
              <iframe
                src={settings.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Tercer Tiempo"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

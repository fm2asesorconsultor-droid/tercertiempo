"use client"

import { MessageCircle, Phone, Clock, MapPin } from "lucide-react"

const schedule = [
  { day: "Lunes – Jueves", hours: "4:00 PM – 12:00 AM" },
  { day: "Viernes", hours: "2:00 PM – 2:00 AM" },
  { day: "Sábados", hours: "12:00 PM – 2:00 AM" },
  { day: "Domingos y Festivos", hours: "12:00 PM – 12:00 AM" },
]

export function ContactInfo() {
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
                href="https://wa.me/573000000000"
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
            <p className="text-zinc-400 text-sm mb-4">Bogotá, Colombia<br />Calle del Estadio #10-25</p>
            <div className="rounded-xl overflow-hidden border border-zinc-700 h-36">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127326.10788961888!2d-74.24785!3d4.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzknMDAuMCJOIDc0wrAxNCc1Mi4zIlc!5e0!3m2!1ses!2sco!4v1625000000000!5m2!1ses!2sco"
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

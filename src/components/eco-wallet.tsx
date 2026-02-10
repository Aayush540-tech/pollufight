"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUp, Clock, Car, Factory, Banknote, Award, Plus, Minus, HardHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { doc, onSnapshot, updateDoc, increment, setDoc, query, collection, where, orderBy, QuerySnapshot, DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getUserId } from "@/lib/user-id"

const TYPE_ICONS: Record<string, any> = {
  "Vehicle Emission": Car,
  "Factory Discharge": Factory,
  "Construction Dust": HardHat,
  "Industrial": Factory,
  "Construction": HardHat,
  "Waste Management": Factory,
}

function AnimatedCheckmark({ delay }: { delay: number }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-neon-green">
      <motion.path
        d="M5 12l5 5L19 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      />
    </svg>
  )
}

export function EcoWallet() {
  const [displayCredits, setDisplayCredits] = useState(0)
  const [flashingCard, setFlashingCard] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>("")
  const [history, setHistory] = useState<any[]>([])

  // Fetch/Create User and Subscribe to Credits
  useEffect(() => {
    const id = getUserId()
    setUserId(id)
    const userRef = doc(db, "user_credits", id)

    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setDisplayCredits(data.credits || 0)
      } else {
        // Create document if it doesn't exist
        try {
          await setDoc(userRef, {
            credits: 150,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        } catch (error) {
          console.error("Error creating user document:", error)
        }
      }
    })

    // Subscribe to User's History
    const historyQuery = query(
      collection(db, "pollution_reports"),
      where("userId", "==", id),
      orderBy("timestamp", "desc")
    )

    const historyUnsubscribe = onSnapshot(historyQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      const reports = snapshot.docs.map(doc => {
        const data = doc.data()
        const timestamp = data.timestamp?.toDate()
        let timeStr = "Just now"

        if (timestamp) {
          const diff = Math.floor((Date.now() - timestamp.getTime()) / 60000)
          if (diff < 1) timeStr = "JUST NOW"
          else if (diff < 60) timeStr = `${diff}M AGO`
          else if (diff < 1440) timeStr = `${Math.floor(diff / 60)}H AGO`
          else timeStr = `${Math.floor(diff / 1440)}D AGO`
        }

        return {
          id: doc.id,
          type: data.type || "Pollution Report",
          credits: data.severity === "critical" ? 50 : 25, // Mock credit values for display
          time: timeStr,
          verified: data.status === "resolved",
          status: data.status
        }
      })
      setHistory(reports)
    })

    return () => {
      unsubscribe()
      historyUnsubscribe()
    }
  }, [])

  const updateCredits = async (amount: number) => {
    if (!userId) return
    const userRef = doc(db, "user_credits", userId)
    try {
      await updateDoc(userRef, {
        credits: increment(amount),
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error("Error updating credits:", error)
    }
  }

  useEffect(() => {
    // We can remove the flashing demo logic since cards are now real or remove it
    // setFlashingCard("demo") // if we had a string ID
  }, [])

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="font-mono text-lg tracking-widest text-foreground">ECOWALLET</h2>
      </motion.div>

      {/* Credits Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 border border-neon-green/30 rounded-xl p-6 text-center"
      >
        <p className="font-mono text-xs text-muted-foreground tracking-wider mb-2">AVAILABLE CREDITS</p>
        <div className="flex items-center justify-center gap-2">
          <p className="font-mono text-5xl font-bold animate-gold-shimmer tabular-nums">{displayCredits}</p>
          <span className="font-mono text-2xl text-neon-gold">Credits</span>
          <ArrowUp className="w-5 h-5 text-neon-green" />
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <motion.div
            className="animate-metallic-sheen"
            animate={{ rotateY: [0, 5, 0, -5, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Award className="w-5 h-5 text-neon-yellow" style={{ filter: "drop-shadow(0 0 4px var(--neon-yellow))" }} />
          </motion.div>
          <p className="font-mono text-xs text-neon-yellow tracking-wider">ELITE SCOUT TIER</p>
        </div>
      </motion.div>

      {/* Verification History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs tracking-wider text-muted-foreground">VERIFICATION HISTORY</h3>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-muted-foreground/30 rounded-xl">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              No reports filed yet
            </p>
          </div>
        ) : (
          history.map((item, index) => {
            const Icon = TYPE_ICONS[item.type] || Factory
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl border bg-card/30 transition-all ${flashingCard === item.id
                  ? "border-neon-green shadow-[0_0_15px_3px_var(--neon-green)]"
                  : "border-border"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-foreground">{item.type}</p>
                    <div className="flex items-center gap-1">
                      <AnimatedCheckmark delay={0.5 + index * 0.2} />
                      <p className="font-mono text-[10px] text-neon-green tracking-wider">
                        {item.status === 'resolved' ? 'VERIFIED' : item.status.toUpperCase()} {item.time}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="font-mono text-lg text-neon-green">+{item.credits}</p>
              </motion.div>
            )
          })
        )}
      </motion.div>

      {/* Redeem Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Button className="w-full font-mono text-xs tracking-wider bg-neon-green text-background hover:bg-neon-green/90 h-12">
          <Banknote className="w-4 h-4 mr-2" />
          REDEEM CREDITS
        </Button>
      </motion.div>

      {/* Test Controls - For Development Only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20"
      >
        <p className="font-mono text-[10px] text-muted-foreground mb-3 text-center uppercase tracking-widest">
          Dev Controls (User ID: {userId.slice(0, 15)}...)
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 font-mono text-xs border-neon-green/50 text-neon-green hover:bg-neon-green/10"
            onClick={() => updateCredits(100)}
          >
            <Plus className="w-3 h-3 mr-2" />
            Add 100
          </Button>
          <Button
            variant="outline"
            className="flex-1 font-mono text-xs border-red-500/50 text-red-500 hover:bg-red-500/10"
            onClick={() => updateCredits(-100)}
          >
            <Minus className="w-3 h-3 mr-2" />
            Remove 100
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

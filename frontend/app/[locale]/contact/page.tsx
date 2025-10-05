"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/common/button"
import { Card } from "@/components/common/shadecn-card"
import { Textarea } from "@/components/common/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { EnhancedCheckbox } from "@/components/common/enhanced-checkbox"
import { Phone, Printer, Mail, MapPin } from "lucide-react"

export default function ContactUs() {
  const [inquiry, setInquiry] = useState("")
  const [message, setMessage] = useState("")
  const [subscribe, setSubscribe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ inquiry, message, subscribe })
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column - Contact Form */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Get in <span className="text-purple-600">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg">Let us know how can we assist you</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Select value={inquiry} onValueChange={setInquiry}>
                <SelectTrigger className="w-full h-12 text-muted-foreground">
                  <SelectValue placeholder="Select your inquiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Write your query here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <EnhancedCheckbox
                id="subscribe"
                checked={subscribe}
                onCheckedChange={setSubscribe}
                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <label htmlFor="subscribe" className="text-sm text-muted-foreground leading-relaxed">
                Subscribe for updates, exclusive offers, and personalized content.
              </label>
            </div>

            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full">
              Send
            </Button>
          </form>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">PHONE</p>
                <p className="text-sm text-purple-600">03 5432 1234</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Printer className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">FAX</p>
                <p className="text-sm text-purple-600">03 5432 1234</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">EMAIL</p>
                <p className="text-sm text-purple-600">info@marcc.com.au</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="lg:sticky lg:top-8">
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="relative h-[500px] bg-gray-100 dark:bg-gray-800">
              {/* Map placeholder with location marker */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Simplified map paths */}
                    <path
                      d="M50 100 Q100 80 150 100 T250 120 Q300 130 350 150"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-400"
                    />
                    <path
                      d="M80 200 Q130 180 180 200 T280 220 Q330 230 380 250"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-400"
                    />
                    <path
                      d="M20 300 Q70 280 120 300 T220 320 Q270 330 320 350"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-400"
                    />
                  </svg>
                </div>

                {/* Location marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-600 rotate-45"></div>
                  </div>
                </div>

                {/* Location labels */}
                <div className="absolute top-16 left-16 text-xs text-gray-600 dark:text-gray-400">
                  <p>Lembaga Kesehatan</p>
                  <p>Budi Kemuliaan</p>
                </div>
                <div className="absolute top-32 right-16 text-xs text-gray-600 dark:text-gray-400">
                  <p>Jalan Kebon Sirih</p>
                </div>
                <div className="absolute bottom-32 left-20 text-xs text-gray-600 dark:text-gray-400">
                  <p>Kampung Bali</p>
                </div>
                <div className="absolute bottom-16 right-20 text-xs text-gray-600 dark:text-gray-400">
                  <p>Kebon Melati</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

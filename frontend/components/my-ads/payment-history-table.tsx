"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/shadecn-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/table"
import { Button } from "@/components/common/button"

export function PaymentHistoryTable() {
  const rows = [
    { date: "25 Apr", name: "iPhone 15 Pro Max", type: "Product", charged: "Monthly", amount: "-25 KD" },
    { date: "15 Apr", name: "Traditional Kuwaiti Feast", type: "Offer", charged: "Monthly", amount: "-15 KD" },
    { date: "09 Apr", name: "iPhone 15 Pro Max", type: "Product", charged: "Monthly", amount: "-25 KD" },
    { date: "25 Mar", name: "Traditional Kuwaiti Feast", type: "Offer", charged: "Annually", amount: "-15 KD" },
  ]

  return (
    <Card style={{ background: "linear-gradient(180deg, rgba(118,44,133,0.04), rgba(231,30,134,0.02))" }}>
      <CardHeader className="flex items-center justify-between gap-4 pb-2 sm:flex-row">
        <CardTitle className="text-lg">Payment History</CardTitle>
        <Button variant="outline" className="ml-auto bg-transparent">
          View All
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Ad Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Charged</TableHead>
              <TableHead className="text-right">Amount Deducted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{r.date}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>{r.charged}</TableCell>
                <TableCell className="text-right text-destructive">{r.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

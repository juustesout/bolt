import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentTransactions() {
  const transactions = [
    {
      id: "1",
      amount: "+$1,999.00",
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      status: "success",
    },
    {
      id: "2",
      amount: "-$89.00",
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      status: "pending",
    },
    {
      id: "3",
      amount: "+$32,000.00",
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      status: "success",
    },
    {
      id: "4",
      amount: "-$256.00",
      name: "William Kim",
      email: "will@email.com",
      status: "success",
    },
    {
      id: "5",
      amount: "-$1,000.00",
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      status: "pending",
    },
  ]

  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${transaction.name}.png`} alt={transaction.name} />
            <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.email}</p>
          </div>
          <div className="ml-auto font-medium">
            {transaction.amount}
          </div>
        </div>
      ))}
    </div>
  )
}
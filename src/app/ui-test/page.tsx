'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'
import { 
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function UITestPage() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold mb-8">UI Components Test</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button Component</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" onClick={() => toast('Default button clicked')}>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Input Component</h2>
        <Input 
          placeholder="Type something..." 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
        />
        <p>Input value: {inputValue}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Textarea Component</h2>
        <Textarea 
          placeholder="Type a longer message..." 
          value={textareaValue} 
          onChange={(e) => setTextareaValue(e.target.value)}
        />
        <p>Textarea value: {textareaValue}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Dropdown Menu Component</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Dropdown</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast('Profile clicked')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast('Settings clicked')}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast('Logout clicked')}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Toast Component</h2>
        <Button onClick={() => toast('This is a success toast!')}>Show Toast</Button>
        <Button onClick={() => toast.error('This is an error toast!')}>Show Error Toast</Button>
        <Button onClick={() => toast.success('This is a success toast!')}>Show Success Toast</Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Avatar Component</h2>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Badge Component</h2>
        <div className="flex gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>
    </div>
  )
} 
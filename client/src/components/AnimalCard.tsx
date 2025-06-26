import React from 'react'
import { type Animal } from '@/types/game'
import { Card, CardContent } from './UI/card'

interface AnimalCardProps {
  animal: Animal;
  showLowerHalf: boolean;
  className?: string;
}
const AnimalCard = () => {
  return (
      <Card className={`border-4 bg-amber-50 shadow-xl overflow-hidden`}>
      <CardContent className="p-0">
        </CardContent>
        </Card>
  )
}

export default AnimalCard
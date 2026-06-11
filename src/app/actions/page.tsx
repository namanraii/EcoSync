/**
 * Actions Page
 * Browse and commit to carbon reduction actions
 */

'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/lib/hooks/use-store'
import { CARBON_ACTIONS, getActionsByCategory } from '@/lib/data/carbon-actions'
import { formatCarbonValue } from '@/lib/utils/calculator'
import { cn } from '@/lib/utils/helpers'

const CATEGORY_ICONS: Record<string, string> = {
  transport: '🚗',
  diet: '🍽️',
  energy: '⚡',
  digital: '💻',
  consumption: '🛍️',
}

export default function ActionsPage(): JSX.Element {
  const { committedActions, actionProgress, commitAction, uncommitAction, updateActionProgress } =
    useStore()
  const [activeCategory, setActiveCategory] = React.useState<string>('all')
  const [selectedAction, setSelectedAction] = React.useState<string | null>(null)

  const categories = ['all', 'transport', 'diet', 'energy', 'digital', 'consumption']

  const filteredActions =
    activeCategory === 'all' ? CARBON_ACTIONS : getActionsByCategory(activeCategory)

  const totalPotentialSavings = CARBON_ACTIONS.filter(
    (a) => !committedActions.includes(a.id)
  ).reduce((sum, a) => sum + a.impactScore, 0)

  const totalCommittedSavings = CARBON_ACTIONS.filter((a) =>
    committedActions.includes(a.id)
  ).reduce((sum, a) => sum + a.impactScore, 0)

  return (
    <>
      <main className="flex-1 py-12">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Carbon Reduction Actions</h1>
            <p className="text-muted-foreground">
              Browse curated actions to reduce your carbon footprint. Each action includes
              quantified impact estimates and implementation guides.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Available Actions</p>
                <p className="text-2xl font-bold">{CARBON_ACTIONS.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Committed</p>
                <p className="text-2xl font-bold text-primary">{committedActions.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Potential Annual Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCarbonValue(totalPotentialSavings + totalCommittedSavings)} CO₂e
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                )}
                aria-pressed={activeCategory === cat}
              >
                {cat === 'all'
                  ? 'All'
                  : `${CATEGORY_ICONS[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
              </button>
            ))}
          </div>

          {/* Actions Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredActions.map((action) => {
              const isCommitted = committedActions.includes(action.id)
              const progress = actionProgress[action.id] || 0
              const isSelected = selectedAction === action.id

              return (
                <Card
                  key={action.id}
                  className={cn(
                    'cursor-pointer transition-all',
                    isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  )}
                  onClick={() => setSelectedAction(isSelected ? null : action.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-lg">{CATEGORY_ICONS[action.category]}</span>
                          <CardTitle className="text-lg">{action.title}</CardTitle>
                        </div>
                        <CardDescription>{action.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          action.difficulty === 'easy'
                            ? 'success'
                            : action.difficulty === 'medium'
                              ? 'warning'
                              : 'destructive'
                        }
                      >
                        {action.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 flex items-center gap-4 text-sm">
                      <span className="font-medium text-green-600">
                        Save {formatCarbonValue(action.impactScore)} CO₂e/yr
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{action.estimatedCost} cost</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{action.timeToImplement}</span>
                    </div>

                    {isCommitted && (
                      <div className="mb-3">
                        <div className="mb-1 flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} size="sm" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {isCommitted ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newProgress = Math.min(100, progress + 25)
                              updateActionProgress(action.id, newProgress)
                            }}
                          >
                            Update Progress
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              uncommitAction(action.id)
                            }}
                          >
                            Uncommit
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            commitAction(action.id)
                          }}
                        >
                          Commit to Action
                        </Button>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="animate-fade-in mt-4 space-y-3 border-t pt-4">
                        <div>
                          <h4 className="mb-2 text-sm font-semibold">Prerequisites</h4>
                          <ul className="list-inside list-disc text-sm text-muted-foreground">
                            {action.prerequisites.map((pre, i) => (
                              <li key={i}>{pre}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 text-sm font-semibold">Steps</h4>
                          <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                            {action.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        {action.resources.length > 0 && (
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Resources</h4>
                            <div className="flex flex-wrap gap-2">
                              {action.resources.map((resource, i) => (
                                <a
                                  key={i}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {resource.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}

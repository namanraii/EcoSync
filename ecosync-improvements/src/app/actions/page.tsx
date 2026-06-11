'use client'

import * as React from 'react'
import { Leaf, Zap, TrendingUp, Monitor, ShoppingBag, Check, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useStore, useCarbonProfile, useCommittedActions, useActionProgress } from '@/lib/hooks/use-store'
import { CARBON_ACTIONS } from '@/lib/data/carbon-actions'
import { formatCarbonValue } from '@/lib/utils/calculator'
import type { EmissionCategory } from '@/types'

const CATEGORY_ICONS: Record<EmissionCategory, React.ReactNode> = {
  transport: <TrendingUp className="h-5 w-5" aria-hidden="true" />,
  diet: <Leaf className="h-5 w-5" aria-hidden="true" />,
  energy: <Zap className="h-5 w-5" aria-hidden="true" />,
  digital: <Monitor className="h-5 w-5" aria-hidden="true" />,
  consumption: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
}

const CATEGORY_LABELS: Record<EmissionCategory, string> = {
  transport: 'Transport',
  diet: 'Diet',
  energy: 'Energy',
  digital: 'Digital',
  consumption: 'Consumption',
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  hard: 'bg-red-100 text-red-700 border-red-200',
}

export default function ActionsPage(): JSX.Element {
  const carbonProfile = useCarbonProfile()
  const committedActions = useCommittedActions()
  const actionProgress = useActionProgress()
  const { commitAction, uncommitAction, updateActionProgress } = useStore()
  const [activeCategory, setActiveCategory] = React.useState<EmissionCategory | 'all'>('all')
  const [filterDifficulty, setFilterDifficulty] = React.useState<string>('all')

  const categories = React.useMemo(() => {
    const cats = new Set<EmissionCategory>()
    CARBON_ACTIONS.forEach((a) => cats.add(a.category))
    return Array.from(cats)
  }, [])

  const filteredActions = React.useMemo(() => {
    let actions = CARBON_ACTIONS
    if (activeCategory !== 'all') {
      actions = actions.filter((a) => a.category === activeCategory)
    }
    if (filterDifficulty !== 'all') {
      actions = actions.filter((a) => a.difficulty === filterDifficulty)
    }
    return actions
  }, [activeCategory, filterDifficulty])

  const committedActionObjects = React.useMemo(() => {
    return CARBON_ACTIONS.filter((a) => committedActions.includes(a.id))
  }, [committedActions])

  const totalPotentialSavings = React.useMemo(() => {
    return filteredActions.reduce((sum, a) => sum + a.impactScore, 0)
  }, [filteredActions])

  const totalCommittedSavings = React.useMemo(() => {
    return committedActionObjects.reduce((sum, a) => sum + a.impactScore, 0)
  }, [committedActionObjects])

  return (
    <main id="main-content" role="main" className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Action Library</h1>
        <p className="mt-1 text-muted-foreground">
          Discover and commit to actions that reduce your carbon footprint.
        </p>
      </header>

      {/* Stats Overview */}
      <section role="region" aria-label="Action statistics" className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card role="region" aria-label="Total available actions">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Available Actions</p>
              <p className="text-3xl font-bold">{filteredActions.length}</p>
            </CardContent>
          </Card>
          <Card role="region" aria-label="Committed actions">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Committed</p>
              <p className="text-3xl font-bold">{committedActions.length}</p>
            </CardContent>
          </Card>
          <Card role="region" aria-label="Potential savings">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Potential Savings</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCarbonValue(totalPotentialSavings)} CO₂e
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Filters */}
      <section role="region" aria-label="Action filters" className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Filter Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
            aria-pressed={activeCategory === 'all'}
            aria-label="Show all categories"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              aria-label={`Filter by ${CATEGORY_LABELS[cat]}`}
            >
              <span className="mr-1.5" aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
              {CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['all', 'easy', 'medium', 'hard'].map((diff) => (
            <Button
              key={diff}
              variant={filterDifficulty === diff ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterDifficulty(diff)}
              aria-pressed={filterDifficulty === diff}
              aria-label={`Filter by ${diff} difficulty`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Button>
          ))}
        </div>
      </section>

      {/* Committed Actions */}
      {committedActionObjects.length > 0 && (
        <section role="region" aria-label="Committed actions" className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">
            Your Committed Actions
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({formatCarbonValue(totalCommittedSavings)} CO₂e/year saved)
            </span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {committedActionObjects.map((action) => {
              const progress = actionProgress[action.id] || 0
              return (
                <Card
                  key={action.id}
                  role="article"
                  aria-label={`Committed action: ${action.title}`}
                  className="border-green-200 bg-green-50/30"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true">{CATEGORY_ICONS[action.category]}</span>
                        <CardTitle className="text-base">{action.title}</CardTitle>
                      </div>
                      <Check className="h-5 w-5 text-green-500" aria-hidden="true" />
                    </div>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress
                        value={progress}
                        className="mt-1"
                        aria-label={`${action.title} progress`}
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateActionProgress(action.id, Math.min(progress + 10, 100))}
                        aria-label={`Increase ${action.title} progress by 10%`}
                      >
                        +10%
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => uncommitAction(action.id)}
                        aria-label={`Remove ${action.title} from committed actions`}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Available Actions */}
      <section role="region" aria-label="Available actions">
        <h2 className="mb-4 text-lg font-semibold">
          Available Actions
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({filteredActions.length} found)
          </span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredActions
            .filter((a) => !committedActions.includes(a.id))
            .map((action) => (
              <Card
                key={action.id}
                role="article"
                aria-label={`Action: ${action.title}`}
                className="transition-all hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">{CATEGORY_ICONS[action.category]}</span>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className={DIFFICULTY_COLORS[action.difficulty]}
                    >
                      {action.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span>Save {formatCarbonValue(action.impactScore)} CO₂e/year</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Cost: {action.estimatedCost}</span>
                      <span>•</span>
                      <span>Time: {action.timeToImplement}</span>
                    </div>
                    {action.prerequisites.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Prerequisites: {action.prerequisites.join(', ')}
                      </div>
                    )}
                  </div>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => commitAction(action.id)}
                    aria-label={`Commit to action: ${action.title}`}
                  >
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Commit to Action
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
        {filteredActions.filter((a) => !committedActions.includes(a.id)).length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No actions match your current filters. Try adjusting your criteria.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

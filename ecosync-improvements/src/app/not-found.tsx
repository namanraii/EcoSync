import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function NotFound(): JSX.Element {
  return (
    <main id="main-content" role="main" className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md text-center" role="alert">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-8 w-8 text-yellow-600" aria-hidden="true" />
          </div>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">Page not found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
          <Button asChild className="mt-6">
            <Link href="/" aria-label="Go back to home page">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Go back home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

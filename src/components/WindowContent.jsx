import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Mail, Github, Twitter } from 'lucide-react';

export function AboutContent() {
  return (
    <div className="space-y-4">
      <CardHeader className="p-0">
        <CardTitle>Hello, I'm Alex Chen</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          A software engineer focused on building minimal, functional interfaces.
          I believe in clarity over cleverness, and intentional design over feature bloat.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Currently working on developer tools and design systems. Previously at
          companies building products used by millions.
        </p>
        <div className="pt-2 border-t mt-4">
          <p className="text-xs text-muted-foreground">
            Based in San Francisco · Available for select projects
          </p>
        </div>
      </CardContent>
    </div>
  );
}

export function ProjectsContent() {
  const projects = [
    {
      name: 'Forma',
      description: 'A design system compiler that outputs production-ready components.',
      tech: ['TypeScript', 'React'],
    },
    {
      name: 'Tempo',
      description: 'Time-tracking CLI for developers who live in the terminal.',
      tech: ['Rust', 'SQLite'],
    },
    {
      name: 'Compose',
      description: 'Markdown editor with real-time collaboration and version control.',
      tech: ['Go', 'WebSocket'],
    },
  ];

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card key={project.name} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{project.name}</CardTitle>
            <CardDescription className="text-sm">{project.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2 flex-wrap">
              {project.tech.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ContactContent() {
  return (
    <div className="space-y-4">
      <CardDescription className="text-sm">
        Open to interesting projects and collaborations.
      </CardDescription>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          asChild
        >
          <a href="mailto:hello@alexchen.dev">
            <Mail className="w-4 h-4 text-muted-foreground" />
            hello@alexchen.dev
          </a>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          asChild
        >
          <a
            href="https://github.com/alexchen"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4 text-muted-foreground" />
            github.com/alexchen
          </a>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          asChild
        >
          <a
            href="https://twitter.com/alexchen"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="w-4 h-4 text-muted-foreground" />
            @alexchen
          </a>
        </Button>
      </div>
    </div>
  );
}

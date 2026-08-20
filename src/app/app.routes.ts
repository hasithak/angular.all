import { Routes } from '@angular/router';

// Custom route resolver function demonstrating routing Resolvers
export const demoResolver = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        resolvedTime: new Date().toLocaleTimeString(),
        resolvedData: 'Loaded from route resolver successfully!',
      });
    }, 500); // Simulate brief network load
  });
};

export const routes: Routes = [
  {
    path: 'login',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
    title: 'Showcase - Dashboard',
  },
  {
    path: 'fundamentals',
    children: [
      {
        path: '',
        redirectTo: 'parent-child',
        pathMatch: 'full'
      },
      {
        path: 'parent-child',
        loadComponent: () => import('./features/fundamentals/parent-child').then((m) => m.ParentChildDemoComponent),
        title: 'Showcase - Parent-Child & ViewChild'
      },
      {
        path: 'viewchildren',
        loadComponent: () => import('./features/fundamentals/viewchildren').then((m) => m.ViewChildrenDemoComponent),
        title: 'Showcase - ViewChildren Query'
      },
      {
        path: 'templateref',
        loadComponent: () => import('./features/fundamentals/templateref').then((m) => m.TemplateRefDemoComponent),
        title: 'Showcase - Template Refs'
      },
      {
        path: 'projection',
        loadComponent: () => import('./features/fundamentals/projection').then((m) => m.ProjectionDemoComponent),
        title: 'Showcase - Content Projection'
      }
    ]
  },
  {
    path: 'databinding',
    loadComponent: () => import('./features/databinding/databinding').then((m) => m.DataBindingComponent),
    title: 'Showcase - Data Binding',
  },
  {
    path: 'directives-pipes',
    loadComponent: () => import('./features/directives-pipes/directives-pipes').then((m) => m.DirectivesPipesComponent),
    title: 'Showcase - Directives & Pipes',
  },
  {
    path: 'di',
    loadComponent: () => import('./features/di/di').then((m) => m.DIComponent),
    title: 'Showcase - Dependency Injection',
  },
  {
    path: 'routing-demo',
    title: 'Showcase - Routing Laboratory',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/routing-demo/routing-demo').then((m) => m.RoutingDemoComponent),
        resolve: { resolverData: demoResolver },
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./features/routing-demo/routing-detail').then((m) => m.RoutingDetailComponent),
        resolve: { resolverData: demoResolver },
        title: 'Showcase - Route Detail',
      },
    ],
  },
  {
    path: 'forms-demo',
    loadComponent: () => import('./features/forms-demo/forms-demo').then((m) => m.FormsDemoComponent),
    title: 'Showcase - Forms Studio',
  },
  {
    path: 'http-demo',
    loadComponent: () => import('./features/http-demo/http-demo').then((m) => m.HttpDemoComponent),
    title: 'Showcase - HTTP Operations',
  },
  {
    path: 'rxjs-demo',
    loadComponent: () => import('./features/rxjs-demo/rxjs-demo').then((m) => m.RxJSDemoComponent),
    title: 'Showcase - RxJS Streams',
  },
  {
    path: 'state-demo',
    loadComponent: () => import('./features/state-demo/state-demo').then((m) => m.StateDemoComponent),
    title: 'Showcase - Reactive State',
  },
  {
    path: 'lifecycle',
    loadComponent: () => import('./features/lifecycle/lifecycle').then((m) => m.LifecycleComponent),
    title: 'Showcase - Component Lifecycle',
  },
  {
    path: 'change-detection',
    loadComponent: () => import('./features/change-detection/change-detection').then((m) => m.ChangeDetectionComponent),
    title: 'Showcase - Change Detection',
  },
  {
    path: 'signals-demo',
    loadComponent: () => import('./features/signals-demo/signals-demo').then((m) => m.SignalsDemoComponent),
    title: 'Showcase - Signals Studio',
  },
  {
    path: 'performance',
    loadComponent: () => import('./features/performance/performance').then((m) => m.PerformanceComponent),
    title: 'Showcase - Performance Suite',
  },
  {
    path: 'control-flow',
    loadComponent: () => import('./features/control-flow/control-flow').then((m) => m.ControlFlowComponent),
    title: 'Showcase - Modern Control Flow',
  },
  {
    path: 'dynamic-components',
    loadComponent: () => import('./features/dynamic-comp/dynamic-comp').then((m) => m.DynamicCompComponent),
    title: 'Showcase - Dynamic Components',
  },
  {
    path: 'security',
    loadComponent: () => import('./features/security-demo/security-demo').then((m) => m.SecurityDemoComponent),
    title: 'Showcase - Security & Sanitization',
  },
  {
    path: 'animations',
    loadComponent: () => import('./features/animations/animations').then((m) => m.AnimationsDemoComponent),
    title: 'Showcase - Animations Arena',
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

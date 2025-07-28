# UI & Styling Conventions

## Layout Philosophy

### Flexbox First
Use Flexbox for most layouts unless CSS Grid is specifically needed:

```typescript
export function ChartHeader() {
  return (
    <div className="flex gap-4 items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon name="chart" />
        <h1 className="text-lg font-semibold">Chart Title</h1>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary">Reset</Button>
        <Button variant="primary">Save</Button>
      </div>
    </div>
  );
}
```

### CSS Grid When Needed
Use CSS Grid for complex layouts or specific grid behavior:

```typescript
// Dashboard layouts
export function DashboardGrid({ widgets }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {widgets.map(widget => (
        <div key={widget.id} className="bg-white rounded-lg shadow p-6">
          <Widget {...widget} />
        </div>
      ))}
    </div>
  );
}

// Form layouts
export function ChartConfigForm() {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Input label="Chart Title" />
      </div>
      <div>
        <Select label="Chart Type" options={chartTypes} />
      </div>
    </form>
  );
}
```

## Responsive Design

### Container Queries
Use container queries for component-based responsive design:

```typescript
export function TimeLineChart({ width }: Props) {
  return (
    <div className="@container">
      <div className="flex gap-4 @max-[600px]:flex-col">
        <div className="flex-grow">
          <ChartCanvas width={width} />
        </div>
        <div className="w-64 @max-[600px]:w-full">
          <ChartControls />
        </div>
      </div>
    </div>
  );
}
```

### Responsive Utilities
Use TailwindCSS responsive prefixes for viewport-based responsiveness:

```typescript
export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Logo />
          <div className="hidden md:flex gap-4">
            <NavLinks />
          </div>
          <div className="md:hidden">
            <MobileMenuButton />
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
          <section className="lg:col-span-3">
            <Content />
          </section>
        </div>
      </main>
    </div>
  );
}
```

## Component Styling Patterns

### Conditional Classes
Use utility functions for conditional styling:

```typescript
// lib/classnames.ts
export function classNames(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Usage in components
export function Button({ variant = 'primary', size = 'md', disabled, children }: Props) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center font-medium rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        
        // Variant styles
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        variant === 'ghost' && 'text-gray-700 hover:bg-gray-100',
        
        // Size styles
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        
        // State styles
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### Type-Safe Style Variants

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost: 'text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};
```

## Asset Organization

```
src/assets/
├── icons/              # SVG icons
├── images/             # Images
└── fonts/              # Custom fonts
```

## Accessibility

### Semantic HTML
Use semantic HTML elements:

```typescript
export function ChartSection() {
  return (
    <section aria-labelledby="chart-title">
      <header>
        <h2 id="chart-title">Signal Chart</h2>
        <p>Real-time data visualization</p>
      </header>
      
      <main>
        <figure>
          <TimeLineChart />
          <figcaption>Chart showing signal data over time</figcaption>
        </figure>
      </main>
      
      <aside>
        <h3>Chart Controls</h3>
        <ChartControls />
      </aside>
    </section>
  );
}
```

### RTL Support
Use logical properties for right-to-left (RTL) layouts:
- `margin-left` → `margin-inline-start`
- `margin-right` → `margin-inline-end` 
- `padding-left` → `padding-inline-start`
- `padding-right` → `padding-inline-end`
- `left` → `inset-inline-start`
- `right` → `inset-inline-end`

## Performance

### Style Optimization
Use reusable style constants:

```typescript
const CARD_STYLES = 'bg-white border rounded-lg shadow-sm p-6';
const BUTTON_BASE = 'inline-flex items-center justify-center font-medium rounded-md transition-colors';

export function ChartCard() {
  return (
    <div className={CARD_STYLES}>
      <TimeLineChart />
      <div className="flex gap-2 mt-4">
        <button className={`${BUTTON_BASE} bg-blue-600 text-white px-4 py-2`}>
          Save
        </button>
      </div>
    </div>
  );
}
```

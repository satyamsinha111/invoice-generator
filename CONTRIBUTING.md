# Contributing to Invoice Generator 🤝

Thank you for your interest in contributing to Invoice Generator! We welcome contributions from the community.

**GitHub Repository**: [https://github.com/satyamsinha111/invoice-generator](https://github.com/satyamsinha111/invoice-generator)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/invoice-generator.git
   cd invoice-generator
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/satyamsinha111/invoice-generator.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📝 How to Contribute

### 1. Find or Create an Issue

- Check [existing issues](https://github.com/satyamsinha111/invoice-generator/issues)
- Create a new issue if needed
- Comment on the issue to claim it

### 2. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `style/` - Code style changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 4. Commit Your Changes

```bash
git add .
git commit -m "Type: Brief description of changes"
```

#### Commit Message Format

```
Type: Brief description (50 chars or less)

More detailed explanation if needed (wrap at 72 chars)

- Bullet points for multiple changes
- Reference issue numbers: Fixes #123
```

**Types**:
- `Add:` - New feature
- `Fix:` - Bug fix
- `Update:` - Update existing feature
- `Remove:` - Remove feature/code
- `Refactor:` - Code refactoring
- `Docs:` - Documentation
- `Style:` - Formatting, missing semicolons, etc.
- `Test:` - Adding tests
- `Chore:` - Maintenance

**Examples**:
```
Add: Invoice duplicate feature

Implements ability to duplicate existing invoices
with a single click. Adds "-COPY" suffix to invoice number.

Fixes #45
```

```
Fix: PDF generation error for large invoices

Resolves issue where invoices with >20 line items
would fail to generate PDF due to memory limit.

Fixes #67
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

1. Go to [https://github.com/satyamsinha111/invoice-generator](https://github.com/satyamsinha111/invoice-generator)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template
5. Submit the PR

---

## 🎯 Areas for Contribution

### High Priority

- 🐛 **Bug Fixes** - Help identify and fix bugs
- 🔒 **Security** - Improve encryption and storage security
- ♿ **Accessibility** - WCAG compliance, screen reader support
- 📱 **Mobile UX** - Improve mobile experience

### Feature Ideas

- 🌍 **Internationalization** - Multi-language support
- 🎨 **Themes** - Dark mode, custom color schemes
- 📊 **Analytics** - Invoice statistics and insights
- 💾 **Export/Import** - Backup and restore functionality
- 📧 **Email Integration** - Send invoices via email
- 🖨️ **Print** - Direct print functionality
- 📅 **Recurring Invoices** - Template-based automation
- 💱 **Multi-Currency** - Better currency support
- 🧾 **Templates** - Pre-designed invoice templates
- 📈 **Reports** - Revenue reports, client summaries

### Documentation

- 📝 **Tutorials** - Step-by-step guides
- 🎥 **Videos** - Screen recordings
- 🌐 **Translations** - Translate documentation
- 📖 **API Docs** - Document code APIs

---

## 💻 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define interfaces for data structures
- Use type annotations
- Avoid `any` type

```typescript
// Good
interface Invoice {
  id: string;
  total: number;
}

// Avoid
const invoice: any = { ... };
```

### React Components

- Use functional components with hooks
- Use descriptive component names
- Keep components focused and small
- Extract reusable logic into custom hooks

```typescript
// Good
export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  // Component logic
}

// Avoid
export default function Component1(props: any) {
  // Too generic
}
```

### File Organization

```
components/
  ├── ComponentName.tsx      # Component
  └── index.ts               # Optional barrel export

lib/
  ├── utils.ts               # Utility functions
  └── types.ts               # Type definitions

app/
  ├── page.tsx               # Route page
  └── layout.tsx             # Layout component
```

### Styling

- Use Tailwind CSS utility classes
- Follow existing design system
- Maintain consistent spacing
- Keep responsive design in mind

```tsx
// Good
<button className="btn-primary">
  Click Me
</button>

// Avoid inline styles
<button style={{ color: 'blue' }}>
  Click Me
</button>
```

### Comments

- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for functions

```typescript
/**
 * Calculate invoice total
 * @param items - Array of line items
 * @returns Total amount rounded to 2 decimals
 */
function calculateTotal(items: LineItem[]): number {
  // Implementation
}
```

---

## 🧪 Testing

### Before Submitting

1. **Test your changes**
   - Create invoices
   - Edit existing invoices
   - Test PDF generation
   - Test storage operations
   - Check responsive design

2. **Test edge cases**
   - Empty states
   - Large datasets
   - Invalid inputs
   - Storage full scenarios

3. **Browser testing**
   - Chrome/Edge
   - Firefox
   - Safari
   - Mobile browsers

### Running Tests

```bash
# Lint check
npm run lint

# Build check
npm run build

# Type check
npx tsc --noEmit
```

---

## 📚 Project Structure

```
invoice-generator/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage (invoice list)
│   ├── invoice/           # Invoice editor routes
│   ├── preview/           # Preview routes
│   └── api/               # API routes
├── components/            # React components
├── contexts/              # React contexts
├── lib/                   # Utilities and types
│   ├── storage.ts        # Storage utility
│   ├── calculations.ts   # Calculation logic
│   └── types.ts          # TypeScript types
└── public/                # Static assets
```

---

## 🔧 Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Puppeteer** - PDF generation
- **crypto-js** - AES encryption
- **lz-string** - Compression

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check [existing issues](https://github.com/satyamsinha111/invoice-generator/issues)
2. Try to reproduce the bug
3. Check if it's already fixed in latest version

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11, macOS 14]
- Browser: [e.g. Chrome 120, Firefox 121]
- Version: [e.g. 1.0.0]

**Additional context**
Any other information about the problem.
```

---

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature related to a problem?**
A clear description of the problem.

**Describe the solution**
A clear description of what you want to happen.

**Describe alternatives**
Any alternative solutions you've considered.

**Additional context**
Mockups, examples, or additional information.
```

---

## 📋 Pull Request Guidelines

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] No new warnings or errors
- [ ] Tested in multiple browsers
- [ ] Mobile responsive (if UI changes)
- [ ] Commit messages follow convention

### PR Template

```markdown
**Description**
Brief description of changes.

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

**Related Issue**
Fixes #(issue number)

**Screenshots**
If applicable, add screenshots.

**Testing**
How has this been tested?

**Checklist**
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested in multiple browsers
```

---

## 🎨 Design Principles

### Keep It Professional

- Clean, minimal design
- Professional color scheme (blues and grays)
- Clear typography hierarchy
- Subtle shadows and borders
- Banking-app aesthetic

### Maintain Consistency

- Follow existing patterns
- Use design system classes
- Consistent spacing
- Uniform component styles

### Focus on UX

- Clear navigation
- Helpful error messages
- Loading states
- Empty states
- Confirmation dialogs for destructive actions

---

## ❓ Questions?

- Open an [issue](https://github.com/satyamsinha111/invoice-generator/issues)
- Check existing [documentation](https://github.com/satyamsinha111/invoice-generator#readme)
- Review [pull requests](https://github.com/satyamsinha111/invoice-generator/pulls)

---

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

**Happy Contributing!** 🎉

---

**Project**: [https://github.com/satyamsinha111/invoice-generator](https://github.com/satyamsinha111/invoice-generator)


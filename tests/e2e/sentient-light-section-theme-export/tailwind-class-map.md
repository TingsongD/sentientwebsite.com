# Tailwind Class Map

Use this when applying the light theme directly in JSX without adding a CSS abstraction.

## Section Wrapper

Replace:

```tsx
className="border-t border-white/10 bg-background ..."
```

With:

```tsx
className="border-y border-[#10213c]/15 bg-[linear-gradient(90deg,rgba(111,255,0,0.14),transparent_18%,transparent_82%,rgba(85,214,255,0.12)),linear-gradient(180deg,#fffdf8,#f7faf4)] text-[#10213c] ..."
```

## Common Text Replacements

```text
text-cream            -> text-[#10213c]
text-cream/70         -> text-[#10213c]/70
text-cream/68         -> text-[#10213c]/68
text-cream/62         -> text-[#10213c]/62
text-cream/58         -> text-[#10213c]/58
text-neon             -> text-[#0b6a31]
border-white/10       -> border-[#10213c]/15
border-neon/20        -> border-[#0b6a31]/25
bg-white/[0.04]       -> bg-white/55
bg-background/55      -> bg-white/45
```

## Panels

For editorial storyboard / proof panels:

```tsx
className="rounded-[4px] border border-[#10213c]/15 bg-white/55 text-[#10213c] shadow-[0_28px_80px_rgba(16,33,60,0.08)]"
```

For stronger product mock panels:

```tsx
className="rounded-[18px] border border-[#10213c]/15 bg-white/70 text-[#10213c] shadow-[0_30px_90px_rgba(16,33,60,0.08)]"
```

## Design Notes

- Use light sections for explanation and proof, not for urgency.
- Do not use neon as body text on light backgrounds. Use `#0b6a31` for labels and accents.
- Keep dark section components dark. Do not force blackhole/funnel visuals onto paper unless they are framed as product screenshots.
- Prefer square or 4px-radius editorial panels on light sections. Use large rounded glass only in dark product-engine sections.


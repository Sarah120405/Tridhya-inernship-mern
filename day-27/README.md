Day 27 — React: Performance Optimization (Load time: 12s → 7.65s via icon fix + code splitting)

Project: Applied optimizations to ShopEase (Redux shopping cart app)

Method: every optimization measured with React DevTools Profiler and the Network tab before and after applying it - no speculative changes without data proving a genuine problem first.

Component re-render fixes (React DevTools Profiler)

1. CartItem.jsx - React.memo

- Before: incrementing one cart item's quantity re-rendered every CartItem (Cart: 15.3ms render)
- Root cause: Cart.jsx maps over the full items array; React re-renders every .map() child by default regardless of individual prop changes
- After: only the changed item re-renders (Cart: 3.7ms) - ~4x reduction

2. ProductCard.jsx - React.memo

- Before: typing in search re-rendered every visible card (ProductList: 17.2ms)
- After: unaffected cards skip re-rendering (ProductList: 3.1ms) - ~5x reduction

3. useMemo (ProductList) and useCallback (CartItem/ProductCard) - evaluated, not applied

- Confirmed via Profiler that neither has a wasted re-render to fix here; documented as correct negative results rather than forced into the code

Bundle/asset weight fixes (Network tab)

4. Icon library consolidation - removed react-icons/fa (3.7MB, used for 3 icons), standardized on react-icons/fi

- Result: 9,485kB -> 5,784kB filtered JS; page load 12s -> 8s

5. Route-based code splitting (React.lazy + Suspense) on Checkout/Orders

- Verified via Network tab: page chunks absent from initial load, fetched only on navigation
- Load: 8s -> 7.65s

6. loading="lazy" on product images - defers off-screen images until scrolled into view

- Load-event timing showed no clear change (7.65s -> 7.72s), likely within measurement noise (~6s run-to-run variance observed); benefit expected in initial paint/bytes-if-never-scrolled, a metric this test didn't isolate

Concepts demonstrated:

- React DevTools Profiler: flame graph, "what caused this update," render duration per commit
- React.memo and shallow prop comparison; why .map() children re-render by default
- useMemo/useCallback's actual justification conditions vs. reflexive use
- Network tab for bundle/asset analysis, distinct from Profiler's re-render focus
- Route-based code splitting with React.lazy/Suspense
- Measurement discipline: recognizing noisy single-run data and reporting honest negative results alongside proven fixes

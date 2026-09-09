# Reflection

## Why This Tech Stack

I chose **Next.js** because I already had good experience with basic React from building a blog, an agency site, and a vet clinic appointment system. This project gave me a real chance to practice and learn Next.js instead of sticking to what I already knew.

I picked **shadcn/ui** because of FE-05, where I built a modal, tabs, and disclosure components by hand using W3C ARIA standards and compared them to shadcn's code. That exercise helped me truly understand accessibility much better than tutorials did. It made me want to use shadcn/ui on a full project because it gives you clean, readable code you can learn from, rather than hiding everything inside an npm package.

I skipped **TypeScript** on purpose because learning both Next.js and TypeScript at the same time felt like too much work and stress. I kept the focus strictly on Next.js with standard JavaScript.

---

## What Was Hardest, and Why

Two main issues stood out.

### 1. `asChild` vs. `render`

Generated code kept including `asChild`, which is a prop used by **Radix UI**. However, this project actually uses **Base UI**, which uses the `render` prop instead.

Because `asChild` does not cause an error and just fails quietly, several buttons and links stopped working without warning until I found every single spot.

This taught me an important lesson: **always verify which library rules a project follows instead of guessing.**

### 2. Setting Up and Testing the AI Assistant

Setting up and testing the **AI Assistant** was difficult for a different reason. The code itself was not the problem, but Gemini's free API has a very small daily limit (around 20 requests per day).

While testing, I would hit this limit in just a few minutes, making it difficult to tell whether my code was broken or if the API was simply blocked.

It was also my first time working with an AI model, so trying to understand new concepts such as **streaming responses** and **tool calling** while dealing with strict rate limits was tricky.

---

## What I'd Do Differently Next Time

I would work on the **AI Assistant page's speed and load times** much earlier instead of waiting until the end. It uses the most JavaScript of any page, so I should plan for **code-splitting** and smaller file sizes from day one rather than fixing performance later.

I would also use **TypeScript** on my next build, since I now have a completed JavaScript project to compare it with.

Lastly, I want to try **Redux** for state management instead of or alongside Zustand so I can learn it by building, rather than just reading about it.

---

## One Thing That Surprised Me

Finding **next-themes** for dark and light modes was a great shortcut. It is much easier than manually writing `dark:` classes on every single element.

What really surprised me was that even though the name suggests it is only for Next.js, it worked without issues in a separate **Vite + React** project I tried.

I originally thought it was locked to Next.js, but after checking with Gemini and Claude, they confirmed it works anywhere—and it did.

---

## Final Reflection

This project brought many firsts: my **first complete website built with Next.js**, my **first time adding a real AI feature**, and my **first time working deeply with shadcn/ui**.

Handling all three at once was a big learning curve, but it also made the project much more valuable. Instead of simply building another React project using tools I already knew, I had to learn new frameworks, libraries, accessibility concepts, and AI development along the way.

Overall, this project helped me move beyond simply *using* technologies and pushed me to understand **why they work, how they work, and when to use them**.
"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Modal } from "@/components/layout/Modal";
import { Drawer } from "@/components/layout/Drawer";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { Display, Heading1, Heading2, Heading3, Body, BodyMuted } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Image } from "@/components/ui/Image";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const colors = [
    { name: "Black", var: "bg-black", text: "text-white" },
    { name: "Off-Black", var: "bg-[#111111]", text: "text-white" },
    { name: "White", var: "bg-white", text: "text-black border border-border" },
    { name: "Ash", var: "bg-[#8F9398]", text: "text-white" },
    { name: "Ash", var: "bg-[var(--color-ash)]", text: "text-white" },
    { name: "Light Ash", var: "bg-[var(--color-light-ash)]", text: "text-black" },
  ];

  return (
    <Container className="py-24 space-y-32">
      {/* 1. Brand / Logo */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">01. Brand & Logo</Heading2>
        <div className="py-12 border-y border-border flex justify-center">
          <Display className="tracking-[0.2em] uppercase">KINGJOEBRIDD</Display>
        </div>
      </section>

      {/* 2. Color Palette */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">02. Color Palette</Heading2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {colors.map((c) => (
            <div key={c.name} className="flex flex-col gap-2">
              <div className={`h-24 w-full rounded-sm ${c.var} ${c.text} flex items-center justify-center font-sans text-xs`}>
                {c.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Typography */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">03. Typography</Heading2>
        <div className="space-y-8">
          <div>
            <Badge variant="muted" className="mb-2">Display (Geist Sans)</Badge>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[var(--color-ash)] uppercase tracking-widest block mb-1">Heading 1</span>
                <h1 className="font-display text-4xl md:text-6xl text-[var(--color-black)] uppercase tracking-widest">
                  The quick brown fox
                </h1>
              </div>
              <div>
                <span className="text-xs text-[var(--color-ash)] uppercase tracking-widest block mb-1">Heading 2</span>
                <h2 className="font-display text-2xl md:text-3xl text-[var(--color-black)] uppercase tracking-widest">
                  Jumps over the lazy dog
                </h2>
              </div>
              <div>
                <span className="text-xs text-[var(--color-ash)] uppercase tracking-widest block mb-1">Heading 3</span>
                <h3 className="font-display text-xl text-[var(--color-black)] uppercase tracking-widest">
                  A beautiful bespoke suit
                </h3>
              </div>
            </div>
          </div>
          <div>
            <Badge variant="muted" className="mb-2">Body (Geist Sans)</Badge>
            <Body>
              KINGJOEBRIDD is a digital fashion house where inspiration becomes craftsmanship. 
              We bring your unique styles to life through bespoke tailoring and carefully selected materials.
            </Body>
          </div>
          <div>
            <Badge variant="muted" className="mb-2">Body Muted</Badge>
            <BodyMuted>
              A contemporary interpretation of classic Nigerian tailoring. Available in multiple fabrics.
            </BodyMuted>
          </div>
        </div>
      </section>

      {/* 5. Buttons */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">05. Buttons</Heading2>
        <div className="flex flex-wrap gap-6 items-center">
          <Button variant="primary">I Want This →</Button>
          <Button variant="secondary">Show Us Your Style</Button>
          <Button variant="outline">Explore Styles</Button>
          <Button variant="ghost">Save for later</Button>
          <Button variant="primary" isLoading>Processing</Button>
          <Button variant="destructive">Remove Item</Button>
        </div>
      </section>

      {/* 6. Icon Buttons */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">06. Icon Buttons</Heading2>
        <div className="flex flex-wrap gap-4 items-center">
          <IconButton variant="outline" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </IconButton>
          <IconButton variant="ghost" aria-label="Menu">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </IconButton>
          <IconButton variant="primary" aria-label="Add">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </IconButton>
        </div>
      </section>

      {/* 7. Badges */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">07. Badges</Heading2>
        <div className="flex flex-wrap gap-4">
          <Badge>Men</Badge>
          <Badge variant="outline">Native</Badge>
          <Badge variant="muted">Ask Availability</Badge>
        </div>
      </section>

      {/* 8-10. Forms */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">08. Forms</Heading2>
        <div className="max-w-md space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <Input placeholder="Enter your name" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Style Details</label>
            <Textarea placeholder="I'd like this in wine..." />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Material</label>
            <Select>
              <option>Select a material</option>
              <option>Linen</option>
              <option>Silk</option>
              <option>Brocade</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm cursor-pointer">I agree to the terms of service</label>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Radio name="delivery" id="pickup" />
              <label htmlFor="pickup" className="text-sm cursor-pointer">Pickup</label>
            </div>
            <div className="flex items-center gap-2">
              <Radio name="delivery" id="delivery" />
              <label htmlFor="delivery" className="text-sm cursor-pointer">Delivery</label>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Cards */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">11. Cards & Images</Heading2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group cursor-pointer">
             {/* Using placeholder image for demo since we have no real assets */}
            <Image 
              src="https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=600&auto=format&fit=crop" 
              alt="Suit" 
              width={600} 
              height={800} 
              aspectRatio="portrait"
              hoverZoom 
              className="mb-4 rounded-sm"
            />
            <Divider className="my-4" />
            <div className="flex justify-between items-start">
              <div>
                <Heading3 className="text-xl">Senator Elegance</Heading3>
                <BodyMuted>Men · Native</BodyMuted>
              </div>
              <span className="text-sm font-semibold tracking-wider text-[var(--color-black)] opacity-0 group-hover:opacity-100 motion-safe-transition">
                I WANT THIS →
              </span>
            </div>
          </div>
          
          <Card>
            <Image 
              src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop" 
              alt="Fabric" 
              width={600} 
              height={400} 
              aspectRatio="landscape"
            />
            <CardContent>
              <Heading3 className="text-lg mb-1">Raw Silk</Heading3>
              <BodyMuted className="mb-4">Smooth finish · Ask availability</BodyMuted>
              <Button variant="outline" className="w-full">Ask About This Material</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 14-15. Overlays */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">14. Overlays</Heading2>
        <div className="flex gap-4">
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Button onClick={() => setIsDrawerOpen(true)} variant="secondary">Open Drawer</Button>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Inspiration">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center flex flex-col items-center">
               <svg className="text-text-muted mb-4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
               <Body>Drop your image or browse</Body>
            </div>
            <Button className="w-full">Send to KINGJOEBRIDD</Button>
          </div>
        </Modal>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Menu">
          <div className="flex flex-col gap-6 text-xl font-display mt-8">
            <a href="#" className="hover:text-[var(--color-ash)] motion-safe-transition">Explore Styles</a>
            <a href="#" className="hover:text-[var(--color-ash)] motion-safe-transition">Materials</a>
            <a href="#" className="hover:text-[var(--color-ash)] motion-safe-transition">How It Works</a>
            <Divider />
            <a href="#" className="hover:text-[var(--color-ash)] motion-safe-transition">Account</a>
          </div>
        </Drawer>
      </section>

      {/* 16-18. Feedback */}
      <section>
        <Heading2 className="mb-8 uppercase tracking-widest text-text-secondary">16. Feedback States</Heading2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Badge variant="muted">Alerts</Badge>
            <Alert variant="default">Your style request has been saved.</Alert>
            <Alert variant="success">Payment confirmed. We are beginning production.</Alert>
            <Alert variant="warning">This material is currently in low stock.</Alert>
            <Alert variant="error">Please provide your measurements before continuing.</Alert>
          </div>
          
          <div className="space-y-4">
            <Badge variant="muted">Skeletons</Badge>
            <div className="flex gap-4 items-center">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
           <Badge variant="muted" className="mb-4">Empty State</Badge>
           <EmptyState 
             title="Your style story starts here."
             description="Ready to make something? Explore the collection or show us your inspiration."
             action={{ label: "Explore Styles →", onClick: () => {} }}
           />
        </div>
      </section>

    </Container>
  );
}

import { Link, useLocation } from 'wouter';
import { Compass, Map, Bookmark, UserRound, Search, Menu, X, ArrowUpRight, Star, Heart, MapPin, ChevronRight, Sparkles, Plus } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { Destination } from '../data/destinations';
import { formatINR, getTrips, getUser } from '../lib/travel';

export function Header() {
  const [path] = useLocation();
  const [open,setOpen] = useState(false);
  const user = getUser();
  const links = [{href:'/dashboard',label:'For you',icon:Compass},{href:'/explore',label:'Explore',icon:Search},{href:'/saved',label:'Saved trips',icon:Bookmark}];
  return <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.94)] backdrop-blur-xl">
    <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
      <Link href="/" className="flex items-center gap-2.5 text-[hsl(var(--foreground))] no-underline" data-testid="link-brand"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--primary))] text-white"><Compass size={19}/></span><span className="font-['Manrope'] text-[19px] font-extrabold tracking-[-.06em]">tripmate<span className="text-[hsl(var(--accent))]">.</span></span></Link>
      <nav className="hidden items-center gap-1 md:flex">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold no-underline transition-colors ${path===href?'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]':'text-[hsl(var(--muted-foreground))] hover:bg-white'}`} data-testid={`nav-${label.toLowerCase().replaceAll(' ','-')}`}><Icon size={15}/>{label}</Link>)}</nav>
      <div className="hidden items-center gap-3 md:flex">{user?<Link href="/profile" className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold no-underline" data-testid="nav-profile"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8eee8] text-xs text-[hsl(var(--primary))]">{user.name.slice(0,1).toUpperCase()}</span>{user.name.split(' ')[0]}</Link>:<><Link href="/login" className="px-3 py-2 text-sm font-semibold text-[hsl(var(--foreground))] no-underline" data-testid="nav-login">Log in</Link><Link href="/signup" className="rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-semibold text-white no-underline hover:opacity-90" data-testid="nav-signup">Get started</Link></>}</div>
      <button onClick={()=>setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-xl border border-[hsl(var(--border))] bg-white md:hidden" aria-label="Toggle menu" data-testid="button-menu">{open?<X size={19}/>:<Menu size={19}/>}</button>
    </div>
    {open&&<nav className="grid gap-1 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 py-3 md:hidden">{links.map(({href,label,icon:Icon})=><Link onClick={()=>setOpen(false)} key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold no-underline" data-testid={`mobile-${label.toLowerCase().replaceAll(' ','-')}`}><Icon size={17}/>{label}</Link>)}{user?<Link href="/profile" className="px-3 py-3 font-semibold no-underline" data-testid="mobile-profile">Your profile</Link>:<Link href="/login" className="px-3 py-3 font-semibold no-underline" data-testid="mobile-login">Log in</Link>}</nav>}
  </header>;
}

export function PageShell({children}:{children:ReactNode}) {
  return <div className="min-h-[100dvh]"><Header/><main className="page-enter">{children}</main><footer className="mt-20 border-t border-[hsl(var(--border))] px-5 py-8 text-center text-xs leading-6 text-[hsl(var(--muted-foreground))]">A more personal way to find your somewhere. <span className="mx-2">·</span> Prices are estimates in INR using a fixed demo rate of ₹85 per US$1. <span className="mx-2">·</span> TripMate demo</footer></div>;
}

export function DestinationCard({place,reason,compact=false}:{place:Destination;reason?:string;compact?:boolean}) {
  const saved = getTrips().some(trip=>trip.destinationId===place.id);
  return <article className={`group overflow-hidden rounded-[24px] border border-[hsl(var(--border))] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(35,61,49,.10)] ${compact?'':'h-full'}`} data-testid={`card-destination-${place.id}`}>
    <Link href={`/destination/${place.id}`} className="block text-inherit no-underline" data-testid={`link-destination-${place.id}`}>
      <div className={`relative overflow-hidden bg-[#e2e7df] ${compact?'h-44':'h-56'}`}><img src={place.image} alt={`${place.name}, ${place.country}`} className="image-shift h-full w-full object-cover" loading="lazy"/><div className="absolute inset-0 bg-gradient-to-t from-[#15251e]/50 via-transparent to-transparent"/><span className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-semibold text-white"><MapPin size={13}/>{place.country}</span><span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1.5 text-[10px] font-bold text-[#39443d]"><Star size={12} className="fill-[#d49c50] text-[#d49c50]"/>{place.rating.toFixed(1)} · demo data</span></div>
      <div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-[21px] font-bold leading-tight">{place.name}</h3><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{place.region}</p></div><span className="whitespace-nowrap rounded-full bg-[#f4f1e9] px-2.5 py-1.5 text-[11px] font-semibold text-[#526157]">Est. {formatINR(place.budget)}/day</span></div>
      {!compact&&<p className="mt-3 line-clamp-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{place.description}</p>}
      {reason&&<p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--primary))]"><Sparkles size={13}/>{reason}</p>}
      <div className="mt-4 flex items-center justify-between border-t border-[#f0eee8] pt-3"><div className="flex flex-wrap gap-1.5">{place.categories.slice(0,3).map(tag=><span key={tag} className="rounded-full bg-[#f6f5f0] px-2.5 py-1 text-[10px] font-medium text-[#637168]">{tag}</span>)}</div><ArrowUpRight size={17} className="text-[hsl(var(--primary))] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></div></div>
    </Link>
  </article>;
}

export function SectionTitle({eyebrow,title,detail,action}:{eyebrow?:string;title:string;detail?:string;action?:ReactNode}) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div>{eyebrow&&<p className="mb-2 text-[11px] font-bold uppercase tracking-[.17em] text-[hsl(var(--primary))]">{eyebrow}</p>}<h2 className="text-[30px] font-bold leading-tight sm:text-[36px]">{title}</h2>{detail&&<p className="mt-2 max-w-xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{detail}</p>}</div>{action}</div>;
}

export function EmptyState({title,copy,href,label}:{title:string;copy:string;href:string;label:string}) {
  return <div className="rounded-[28px] border border-dashed border-[#cbd4c9] bg-[#f4f4ec] px-6 py-14 text-center" data-testid="empty-state"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[hsl(var(--primary))]"><Map size={23}/></span><h2 className="mt-5 text-2xl font-bold">{title}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">{copy}</p><Link href={href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-white no-underline" data-testid="link-empty-action">{label}<ChevronRight size={16}/></Link></div>;
}

export function SaveButton({destinationId}:{destinationId:string}) {
  const [,setLocation]=useLocation(); const [isSaved,setIsSaved]=useState(()=>getTrips().some(x=>x.destinationId===destinationId));
  const toggle=()=>{ const trips=getTrips(); const match=trips.find(x=>x.destinationId===destinationId); if(match){localStorage.setItem('tripmate-saved-trips',JSON.stringify(trips.filter(x=>x.id!==match.id)));setIsSaved(false);} else {setLocation(`/planner?destination=${destinationId}`);} };
  return <button onClick={toggle} className={`grid h-11 w-11 place-items-center rounded-full border ${isSaved?'border-[#efdad1] bg-[#fbefea] text-[hsl(var(--accent))]':'border-[hsl(var(--border))] bg-white text-[hsl(var(--foreground))]'}`} aria-label={isSaved?'Saved trip':'Plan this trip'} data-testid="button-save-destination">{isSaved?<Heart size={18} className="fill-current"/>:<Plus size={18}/>}</button>;
}

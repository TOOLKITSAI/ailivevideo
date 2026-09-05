import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
const phase=process.argv[2]||'before', base='http://127.0.0.1:4322';
const out=`audit/${phase}`; await fs.mkdir(out,{recursive:true});
async function walk(dir) { let a=[]; for(const e of await fs.readdir(dir,{withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory()) a.push(...await walk(p)); else if(e.name.endsWith('.html')) a.push(p); } return a; }
const routes=(await walk('dist')).map(p=>'/'+path.relative('dist',p).replaceAll('\\','/').replace(/index\.html$/,'')).sort();
const browser=await chromium.launch({headless:true});
const accessibility=[];
const pages=[]; const visuals=[];
for(const width of [1440,390,360,768]) {
 const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1}); const page=await context.newPage();
 for(const route of routes) {
  const errors=[],failures=[]; const onError=e=>errors.push(e.message); const onConsole=m=>{if(m.type()==='error') errors.push(m.text())}; const onResponse=r=>{if(r.status()>=400) failures.push({url:r.url(),status:r.status()})};
  page.on('pageerror',onError); page.on('console',onConsole); page.on('response',onResponse);
  const response=await page.goto(base+route,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready; for(const i of document.images) {i.loading='eager'; await i.decode().catch(()=>{});} });
  const data=await page.evaluate(()=>{
   const meta=n=>document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content||'';
   const main=document.querySelector('main'); const body=main?.cloneNode(true); body?.querySelectorAll('script,style,nav,[hidden],.breadcrumbs').forEach(e=>e.remove());
   const walker=document.createTreeWalker(main||document.body,NodeFilter.SHOW_TEXT); const pieces=[]; while(walker.nextNode()){const parent=walker.currentNode.parentElement;if(parent&&!parent.closest('script,style,nav,form,[hidden],.breadcrumbs')&&parent.getClientRects().length&&getComputedStyle(parent).visibility!=='hidden')pieces.push(walker.currentNode.textContent);} const text=pieces.join(' ').replace(/\s+/g,' ').trim();
   const visible=e=>e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';
   const overflow=[...document.querySelectorAll('body *')].filter(e=>visible(e)&&!e.closest('.skip-link')&&!e.closest('.table-scroll')).filter(e=>{let r=e.getBoundingClientRect();return r.right>innerWidth+1||r.left < -1}).slice(0,20).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,90)}));
   return {title:document.title,description:meta('description'),h1:[...document.querySelectorAll('h1')].map(e=>e.innerText),text,canonical:document.querySelector('link[rel="canonical"]')?.href,robots:meta('robots'),lang:document.documentElement.lang,og:{title:meta('og:title'),description:meta('og:description'),url:meta('og:url'),image:meta('og:image'),type:meta('og:type')},favicon:[...document.querySelectorAll('link[rel*="icon"]')].map(e=>e.href),schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>{try{return JSON.parse(e.textContent)}catch{return 'INVALID_JSON'}}),links:[...document.querySelectorAll('a[href]')].map(e=>({href:e.getAttribute('href'),text:e.innerText})),ids:[...document.querySelectorAll('[id]')].map(e=>e.id),images:[...document.images].map(e=>({src:e.getAttribute('src'),alt:e.getAttribute('alt'),width:e.getAttribute('width'),height:e.getAttribute('height'),naturalWidth:e.naturalWidth,loading:e.loading})),overflow,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,unlabeled:[...document.querySelectorAll('input:not([type="hidden"]),select,textarea')].filter(e=>!e.labels?.length&&!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')).map(e=>e.outerHTML),tables:document.querySelectorAll('table').length,codeBlocks:document.querySelectorAll('pre').length};
  });
  if(width===1440||width===390){await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const axe=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));accessibility.push({route,width,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))})),incomplete:axe.incomplete.map(v=>v.id)});}
  const file=(route==='/'?'home':route.replace(/^\//,'').replaceAll('/','_'))+`-${width}.png`;
  await page.screenshot({path:`${out}/${file}`,fullPage:true});
  visuals.push({route,width,status:response.status(),overflow:data.overflow,scrollWidth:data.scrollWidth,errors,failures,screenshot:file});
  if(width===1440) pages.push({route,status:response.status(),...data});
  page.off('pageerror',onError); page.off('console',onConsole); page.off('response',onResponse);
 }
 await context.close(); console.log(`Audited ${routes.length} pages at ${width}px`);
}
const context=await browser.newContext(); const p=await context.newPage();const probes=[];
for(const route of ['/contact/','/disclaimer/','/404.html','/__audit_missing_page__/','/tools/__missing__/','/sitemap.xml','/sitemap-index.xml','/sitemap-0.xml','/robots.txt','/favicon.ico','/favicon.svg']) { const r=await p.goto(base+route); probes.push({route,status:r.status(),title:await p.title(),url:p.url()}); }
await browser.close();
const map=new Map(pages.map(p=>[p.route,p])); const broken=[],external=new Map(),incoming=new Map(routes.map(r=>[r,[]]));
for(const p of pages) for(const l of p.links) {const u=new URL(l.href,base+p.route); if(u.origin!==base) {if(/^https?:/.test(u.protocol))external.set(u.href,[...(external.get(u.href)||[]),p.route]);continue;} if(!map.has(u.pathname)){broken.push({from:p.route,href:l.href,reason:'missing route'});continue;}if(p.route!==u.pathname)incoming.get(u.pathname).push(p.route);if(u.hash&&!map.get(u.pathname).ids.includes(decodeURIComponent(u.hash.slice(1))))broken.push({from:p.route,href:l.href,reason:'missing anchor'});}
const sitemap=await fs.readFile('dist/sitemap-0.xml','utf8');const duplicates={};for(const key of ['title','description','h1','canonical']){const groups=new Map();for(const p of pages){const v=String(p[key]);groups.set(v,[...(groups.get(v)||[]),p.route]);}duplicates[key]=[...groups].filter(([,v])=>v.length>1);}
const report={accessibility,phase,checkedAt:new Date().toISOString(),pages,visuals,probes,broken,external:[...external].map(([url,from])=>({url,from:[...new Set(from)]})),orphans:[...incoming].filter(([r,v])=>r!=='/'&&r!=='/404.html'&&!v.length).map(([r])=>r),missingSitemap:pages.filter(p=>!p.robots.includes('noindex')&&!sitemap.includes(p.canonical)).map(p=>p.route),duplicates};
await fs.writeFile(`${out}/results.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({pages:pages.length,visuals:visuals.length,a11y:accessibility.filter(x=>x.violations.length),broken,orphans:report.orphans,missingSitemap:report.missingSitemap,duplicates,overflow:visuals.filter(v=>v.overflow.length).map(v=>({route:v.route,width:v.width,overflow:v.overflow})),errors:visuals.filter(v=>v.errors.length||v.failures.length),probes},null,2));

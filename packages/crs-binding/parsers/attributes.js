async function e(t,r,s,a){if(t.attributes==null)return;const i=Array.from(t.attributes);for(const u of i)await crs.binding.parsers.parseAttribute(u,r,s,a)}export{e as parseAttributes};

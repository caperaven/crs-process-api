class c{static async perform(e,s,t,a){await this[e.action]?.(e,s,t,a)}static async copy_to_clipboard(e,s,t,a){let r=await crs.process.getValue(e.args.source,s,t,a),i=JSON.stringify(r);navigator.clipboard.writeText(i)}static async sleep(e,s,t,a){return new Promise(async r=>{const i=await crs.process.getValue(e.args.duration,s,t,a);let n=setInterval(()=>{clearInterval(n),r()},Number(i||0))})}static async pause(e,s,t){return new Promise(a=>{t.status="wait";let r;const i=n=>{delete t.status,delete t.resume,delete r?.resume,typeof n!="object"&&(e.alt_next_step=n),a()};t.parameters?.bId!=null&&(r=crsbinding.data.getContext(t.parameters.bId),r.resume=i),t.resume=i})}static async resume(e,s,t,a){t.resume?.()}static async abort(e,s,t,a){const r=await crs.process.getValue(e.args.error,s,t,a);throw new Error(r)}static async is_mobile(e,s,t,a){return/Mobi/.test(navigator.userAgent)}static async is_portrait(e,s,t,a){let r=window.matchMedia("(orientation: portrait)").matches;return e?.args?.target!=null&&await crs.process.setValue(e.args.target,r,s,t,a),r}static async is_landscape(e,s,t,a){let r=window.matchMedia("(orientation: landscape)").matches;return e?.args?.target!=null&&await crs.process.setValue(e.args.target,r,s,t,a),r}}crs.intent.system=c;export{c as SystemActions};

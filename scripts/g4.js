const s=require("sharp"), p=require("path"), f=require("fs");
async function main(){
  const src=p.join("public/images","gallery-source-4.jpg"), out=p.join("public/images","gallery-4.webp"), wm="public/user-watermark-new.jpg";
  const m=await s(src).metadata();
  const b=await s(src).resize({width:600,fit:"inside",withoutEnlargement:true}).webp({quality:65}).toBuffer();
  const w=Math.round(m.width*0.25);
  const wmb=await s(wm).resize({width:w,withoutEnlargement:true}).png().toBuffer();
  const f2=await s(b).composite([{input:wmb,gravity:"center",blend:"multiply",opacity:0.3}]).webp({quality:65}).toBuffer();
  f.writeFileSync(out,f2);
  console.log("gallery-4.webp:",f2.length,"bytes");
  f.unlinkSync(src);
}
main().catch(e=>console.error(e));

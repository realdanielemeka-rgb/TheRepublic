import asyncio, json, sys
from harness import page, BASE
from playwright.async_api import async_playwright
AXE=open('node_modules/axe-core/axe.min.js').read()
ROUTES=['gate','work','onga-case','studio','method','journal','contact','privacy','twisco-case']
async def run(w,h,tag,mobile=False):
    async with async_playwright() as p:
        b,pg,errs=await page(p,w,h,mobile)
        await pg.goto(BASE); await pg.wait_for_timeout(3000)
        await pg.add_script_tag(content=AXE)
        agg={}
        for r in ROUTES:
            await pg.evaluate(f"location.hash='{r}'"); await pg.wait_for_timeout(1500)
            res=await pg.evaluate("""async () => { const r = await axe.run(document, { resultTypes: ['violations'], rules: { region: { enabled: false } } });
              return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0, 4).map(n => (n.target.join(' ') + ' :: ' + (n.any[0] ? n.any[0].message : n.failureSummary || '')).slice(0, 220)) })); }""")
            for v in res:
                k=v['id']; a=agg.setdefault(k,{'impact':v['impact'],'routes':{},'ex':[]})
                a['routes'][r]=v['n']; a['ex']+= [r+': '+e for e in v['ex'][:2]]
        for k,a in sorted(agg.items(), key=lambda x: x[1]['impact'] or ''):
            print(f"== {k} [{a['impact']}] {a['routes']}")
            for e in a['ex'][:6]: print('   ',e)
        await b.close()
asyncio.run(run(1440,900,'d') if (len(sys.argv)<2 or sys.argv[1]=='d') else run(390,844,'m',True))

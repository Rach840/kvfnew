(()=>{var e={};e.id=454,e.ids=[454],e.modules={96330:e=>{"use strict";e.exports=require("@prisma/client")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{"use strict";e.exports=require("assert")},79428:e=>{"use strict";e.exports=require("buffer")},55511:e=>{"use strict";e.exports=require("crypto")},94735:e=>{"use strict";e.exports=require("events")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},33873:e=>{"use strict";e.exports=require("path")},11723:e=>{"use strict";e.exports=require("querystring")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},99789:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>l.a,__next_app__:()=>c,pages:()=>m,routeModule:()=>u,tree:()=>d});var r=t(70260),a=t(28203),i=t(25155),l=t.n(i),n=t(67292),o={};for(let e in n)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>n[e]);t.d(s,o);let d=["",{children:["register",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,17358)),"C:\\Users\\rachb\\Downloads\\Telegram Desktop\\kvfNew\\app\\register\\page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(t.bind(t,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],types:["__DEFAULT__",{},{defaultPage:[()=>Promise.resolve().then(t.t.bind(t,97507,23)),"next/dist/client/components/parallel-route-default.js"]}]},{layout:[()=>Promise.resolve().then(t.bind(t,19611)),"C:\\Users\\rachb\\Downloads\\Telegram Desktop\\kvfNew\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(t.bind(t,61129)),"C:\\Users\\rachb\\Downloads\\Telegram Desktop\\kvfNew\\app\\not-found.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(t.bind(t,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],m=["C:\\Users\\rachb\\Downloads\\Telegram Desktop\\kvfNew\\app\\register\\page.tsx"],c={require:t,loadChunk:()=>Promise.resolve()},u=new r.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/register/page",pathname:"/register",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},91414:(e,s,t)=>{Promise.resolve().then(t.bind(t,17358))},86686:(e,s,t)=>{Promise.resolve().then(t.bind(t,22930))},22930:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>h});var r=t(45512);t(58009);var a=t(6868),i=t(81914),l=t(26248);let n=(0,l.createServerReference)("4057d50ba7f574ca4cf249db64cb11d433b9d8e6f4",l.callServer,void 0,l.findSourceMapURL,"registerUser");var o=t(86277),d=t(15310),m=t(87021),c=t(90993),u=t(79334),x=t(54069),p=t(94727);let f=({})=>{let e=(0,u.useRouter)(),s=(0,a.mN)({resolver:(0,i.u)(o.Do),defaultValues:{firstName:"",lastName:"",surName:"",email:"",password:"",startTest:"",organisation:"",role:""}}),t=async s=>{console.log(s);let t=await n({firstName:s.firstName,lastName:s.lastName,surName:s.surName?s.surName:"",email:s.email,password:s.password,startTest:s.startTest,organisation:s.organisation?s.organisation:"",role:s.role,okAnswers:0,testsResult:"[]"});console.log({result:t});try{t.success&&(0,c.signIn)("credentials",{email:s.email,password:s.password,redirect:!1}).then(()=>e.push("/"))}catch(e){console.log(e)}};return(0,r.jsx)(a.Op,{...s,children:(0,r.jsx)("form",{className:"flex border-x-2 container mx-auto px-10 bg-white border-y-2 rounded-lg   border-gray-900/10 pb-12 flex-col ",onSubmit:s.handleSubmit(t),children:(0,r.jsx)("div",{className:" container   mx-auto",children:(0,r.jsxs)("div",{className:" my-4 py-10 ",children:[(0,r.jsx)("h2",{className:" text-3xl font-semibold text-gray-900",children:"Регистрация"}),(0,r.jsx)("p",{className:"mt-1 text-sm/6 text-gray-600",children:"Зарегистрируетесь для доступа к тестам"}),(0,r.jsxs)("div",{className:"flex",children:[(0,r.jsxs)("div",{className:"mt-10 w-9/12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6",children:[(0,r.jsxs)("div",{className:"sm:col-span-2",children:[(0,r.jsx)("label",{htmlFor:"first-name",className:"block text-sm/6 font-medium text-gray-900"}),(0,r.jsx)("div",{className:"mt-2",children:(0,r.jsx)(d.Z,{name:"firstName",label:"Имя",required:!0})})]}),(0,r.jsxs)("div",{className:"sm:col-span-2",children:[(0,r.jsx)("label",{htmlFor:"last-name",className:"block text-sm/6 font-medium text-gray-900"}),(0,r.jsx)("div",{className:"mt-2",children:(0,r.jsx)(d.Z,{name:"lastName",label:"Фамилия",required:!0})})]}),(0,r.jsxs)("div",{className:"sm:col-span-2",children:[(0,r.jsx)("label",{htmlFor:"sur-name",className:"block text-sm/6 font-medium text-gray-900"}),(0,r.jsx)("div",{className:"mt-2",children:(0,r.jsx)(d.Z,{name:"surName",label:"Отчество",required:!0})})]}),(0,r.jsxs)("div",{className:"sm:col-span-3",children:[(0,r.jsx)("label",{htmlFor:"email",className:"block text-sm/6 font-medium text-gray-900"}),(0,r.jsx)("div",{className:"mt-2",children:(0,r.jsx)(d.Z,{name:"email",label:"Адрес электронной почты",required:!0})})]}),(0,r.jsxs)("div",{className:"sm:col-span-3",children:[(0,r.jsx)("label",{htmlFor:"email",className:"block text-sm/6 font-medium text-gray-900"}),(0,r.jsx)("div",{className:"mt-2",children:(0,r.jsx)(d.Z,{name:"password",label:"Пароль",type:"password",required:!0})})]}),(0,r.jsxs)("div",{className:"sm:col-span-3",children:[(0,r.jsx)("label",{htmlFor:"country",className:"block text-sm/6 font-medium text-gray-900",children:"Категория"}),(0,r.jsx)("div",{className:"mt-2 grid grid-cols-1",children:(0,r.jsx)(p.zB,{control:s.control,name:"role",render:({field:e})=>(0,r.jsxs)(p.eI,{children:[(0,r.jsxs)(x.l6,{onValueChange:e.onChange,defaultValue:e.value,children:[(0,r.jsx)(p.MJ,{children:(0,r.jsx)(x.bq,{children:(0,r.jsx)(x.yv,{})})}),(0,r.jsxs)(x.gC,{children:[(0,r.jsx)(x.eb,{value:"STUDENT",children:"Студент"}),(0,r.jsx)(x.eb,{value:"SCHOOLBOY",children:"Школьник"}),(0,r.jsx)(x.eb,{value:"SPECIALIST",children:"Специалист"})]})]}),(0,r.jsx)(p.C5,{className:"text-red-500 text-sm mt-1"})]})})}),(0,r.jsxs)("div",{className:"sm:col-span-3",children:[(0,r.jsx)("label",{htmlFor:"country",className:"block text-sm/6 font-medium text-gray-900",children:"Категория начального теста"}),(0,r.jsx)("div",{className:"mt-2 grid grid-cols-1",children:(0,r.jsx)(p.zB,{control:s.control,name:"startTest",render:({field:e})=>(0,r.jsxs)(p.eI,{children:[(0,r.jsxs)(x.l6,{onValueChange:e.onChange,defaultValue:e.value,children:[(0,r.jsx)(p.MJ,{children:(0,r.jsx)(x.bq,{children:(0,r.jsx)(x.yv,{})})}),(0,r.jsxs)(x.gC,{children:[(0,r.jsx)(x.eb,{value:"TRAINING",children:"Тренировочный"}),(0,r.jsx)(x.eb,{value:"QUALIFYING",children:"Отборочный"}),(0,r.jsx)(x.eb,{value:"BASIC",children:"Основной"})]})]}),(0,r.jsx)(p.C5,{className:"text-red-500 text-sm mt-1"})]})})})]})]}),(0,r.jsxs)("div",{className:"sm:col-span-3",children:[(0,r.jsx)("label",{htmlFor:"organisation",className:"block text-sm/6 font-medium text-gray-900"}),(0,r.jsx)("div",{className:"mt-2",children:(0,r.jsx)(d.Z,{name:"organisation",label:"Организация",required:!0})})]}),(0,r.jsx)(m.$,{loading:s.formState.isSubmitting,variant:"secondary",className:"duration-300 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",type:"submit",children:"Зарегистрироваться"})]}),(0,r.jsx)("img",{src:"../registr.png",className:"mx-auto mt-10 h-1/4 w-2/12"})]})]})})})})};function h(){return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(f,{})})}},15310:(e,s,t)=>{"use strict";t.d(s,{Z:()=>c});var r=t(45512),a=t(6868),i=t(25409),l=t(59462),n=t(44269);t(58009);let o=({onClick:e,className:s})=>(0,r.jsx)("button",{onClick:e,className:(0,l.cn)("absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer",s),children:(0,r.jsx)(n.A,{className:"h-5 w-5"})}),d=({text:e,className:s})=>(0,r.jsx)("p",{className:(0,l.cn)("text-red-500 text-sm",s),children:e}),m=()=>(0,r.jsx)("span",{className:"text-red-500",children:"*"}),c=({className:e,name:s,label:t,required:l,defaultValue:n,...c})=>{let{register:u,formState:{errors:x},watch:p,setValue:f}=(0,a.xW)(),h=p(s),g=x[s]?.message;return(0,r.jsxs)("div",{className:e,children:[t&&(0,r.jsxs)("p",{className:"font-medium mb-2",children:[t," ",l&&(0,r.jsx)(m,{})]}),(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)(i.p,{defaultValue:n||"",className:"h-12 text-md",...u(s),...c}),h&&(0,r.jsx)(o,{onClick:()=>{f(s,"",{shouldValidate:!0})}})]}),g&&(0,r.jsx)(d,{text:g,className:"mt-2"})]})}},86277:(e,s,t)=>{"use strict";t.d(s,{Do:()=>l,IK:()=>i,X5:()=>a});var r=t(16131);let a=r.z.object({email:r.z.string().email({message:"Введите корректную почту"}),password:r.z.string().min(6,{message:"Пароль должен содержать минимум 6 символов"}).refine(e=>/[A-Z]/.test(e),{message:"Пароль должен содержать хотя бы одну заглавную букву"}).refine(e=>/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(e),{message:"Пароль должен содержать хотя бы один специальный символ"}).refine(e=>/[0-9]/.test(e),{message:"Пароль должен содержать хотя бы одну цифру"})});r.z.object({name:r.z.string()});let i=r.z.object({name:r.z.string(),category:r.z.string(),text:r.z.string()}),l=r.z.object({firstName:r.z.string().min(3,{message:"Имя пользователя должно содержать минимум 3 символа"}),lastName:r.z.string().min(3,{message:"Фамилия пользователя должна содержать минимум 3 символа"}),surName:r.z.string(),email:r.z.string().email({message:"Введите корректную почту"}),password:r.z.string().min(6,{message:"Пароль должен содержать минимум 6 символов"}).refine(e=>/[A-Z]/.test(e),{message:"Пароль должен содержать хотя бы одну заглавную букву"}).refine(e=>/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(e),{message:"Пароль должен содержать хотя бы один специальный символ"}).refine(e=>/[0-9]/.test(e),{message:"Пароль должен содержать хотя бы одну цифру"}),organisation:r.z.string(),role:r.z.string().min(1,{message:"Выберите категорию"}),startTest:r.z.string().min(1,{message:"Выберите уровень теста"})})},94727:(e,s,t)=>{"use strict";t.d(s,{C5:()=>f,MJ:()=>p,eI:()=>x,zB:()=>m});var r=t(45512),a=t(58009),i=t(12705),l=t(6868),n=t(59462),o=t(47699);let d=a.createContext({}),m=({...e})=>(0,r.jsx)(d.Provider,{value:{name:e.name},children:(0,r.jsx)(l.xI,{...e})}),c=()=>{let e=a.useContext(d),s=a.useContext(u),{getFieldState:t,formState:r}=(0,l.xW)(),i=t(e.name,r);if(!e)throw Error("useFormField should be used within <FormField>");let{id:n}=s;return{id:n,name:e.name,formItemId:`${n}-form-item`,formDescriptionId:`${n}-form-item-description`,formMessageId:`${n}-form-item-message`,...i}},u=a.createContext({}),x=a.forwardRef(({className:e,...s},t)=>{let i=a.useId();return(0,r.jsx)(u.Provider,{value:{id:i},children:(0,r.jsx)("div",{ref:t,className:(0,n.cn)("space-y-2",e),...s})})});x.displayName="FormItem",a.forwardRef(({className:e,...s},t)=>{let{error:a,formItemId:i}=c();return(0,r.jsx)(o.J,{ref:t,className:(0,n.cn)(a&&"text-destructive",e),htmlFor:i,...s})}).displayName="FormLabel";let p=a.forwardRef(({...e},s)=>{let{error:t,formItemId:a,formDescriptionId:l,formMessageId:n}=c();return(0,r.jsx)(i.DX,{ref:s,id:a,"aria-describedby":t?`${l} ${n}`:`${l}`,"aria-invalid":!!t,...e})});p.displayName="FormControl",a.forwardRef(({className:e,...s},t)=>{let{formDescriptionId:a}=c();return(0,r.jsx)("p",{ref:t,id:a,className:(0,n.cn)("text-[0.8rem] text-muted-foreground",e),...s})}).displayName="FormDescription";let f=a.forwardRef(({className:e,children:s,...t},a)=>{let{error:i,formMessageId:l}=c(),o=i?String(i?.message):s;return o?(0,r.jsx)("p",{ref:a,id:l,className:(0,n.cn)("text-[0.8rem] font-medium text-destructive",e),...t,children:o}):null});f.displayName="FormMessage"},25409:(e,s,t)=>{"use strict";t.d(s,{p:()=>l});var r=t(45512),a=t(58009),i=t(59462);let l=a.forwardRef(({className:e,type:s,...t},a)=>(0,r.jsx)("input",{type:s,className:(0,i.cn)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),ref:a,...t}));l.displayName="Input"},54069:(e,s,t)=>{"use strict";t.d(s,{bq:()=>u,eb:()=>h,gC:()=>f,l6:()=>m,yv:()=>c});var r=t(45512),a=t(58009),i=t(17638),l=t(98755),n=t(28638),o=t(24849),d=t(59462);let m=i.bL;i.YJ;let c=i.WT,u=a.forwardRef(({className:e,children:s,...t},a)=>(0,r.jsxs)(i.l9,{ref:a,className:(0,d.cn)("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",e),...t,children:[s,(0,r.jsx)(i.In,{asChild:!0,children:(0,r.jsx)(l.A,{className:"h-4 w-4 opacity-50"})})]}));u.displayName=i.l9.displayName;let x=a.forwardRef(({className:e,...s},t)=>(0,r.jsx)(i.PP,{ref:t,className:(0,d.cn)("flex cursor-default items-center justify-center py-1",e),...s,children:(0,r.jsx)(n.A,{className:"h-4 w-4"})}));x.displayName=i.PP.displayName;let p=a.forwardRef(({className:e,...s},t)=>(0,r.jsx)(i.wn,{ref:t,className:(0,d.cn)("flex cursor-default items-center justify-center py-1",e),...s,children:(0,r.jsx)(l.A,{className:"h-4 w-4"})}));p.displayName=i.wn.displayName;let f=a.forwardRef(({className:e,children:s,position:t="popper",...a},l)=>(0,r.jsx)(i.ZL,{children:(0,r.jsxs)(i.UC,{ref:l,className:(0,d.cn)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2","popper"===t&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",e),position:t,...a,children:[(0,r.jsx)(x,{}),(0,r.jsx)(i.LM,{className:(0,d.cn)("p-1","popper"===t&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:s}),(0,r.jsx)(p,{})]})}));f.displayName=i.UC.displayName,a.forwardRef(({className:e,...s},t)=>(0,r.jsx)(i.JU,{ref:t,className:(0,d.cn)("px-2 py-1.5 text-sm font-semibold",e),...s})).displayName=i.JU.displayName;let h=a.forwardRef(({className:e,children:s,...t},a)=>(0,r.jsxs)(i.q7,{ref:a,className:(0,d.cn)("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",e),...t,children:[(0,r.jsx)("span",{className:"absolute right-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,r.jsx)(i.VF,{children:(0,r.jsx)(o.A,{className:"h-4 w-4"})})}),(0,r.jsx)(i.p4,{children:s})]}));h.displayName=i.q7.displayName,a.forwardRef(({className:e,...s},t)=>(0,r.jsx)(i.wv,{ref:t,className:(0,d.cn)("-mx-1 my-1 h-px bg-muted",e),...s})).displayName=i.wv.displayName},17358:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>r});let r=(0,t(46760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"C:\\\\Users\\\\rachb\\\\Downloads\\\\Telegram Desktop\\\\kvfNew\\\\app\\\\register\\\\page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\rachb\\Downloads\\Telegram Desktop\\kvfNew\\app\\register\\page.tsx","default")}};var s=require("../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),r=s.X(0,[989,934,835,750,818,987,585,226],()=>t(99789));module.exports=r})();
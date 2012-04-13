//A5, Copyright (c) 2011, Jeff dePascale & Brian Sutliffe. http://www.jeffdepascale.com(function(a,b){(function(){var e=null,c=function(p,m,j){var q,o,k,n;if(!p){return null}j=j||false;if(typeof p==="object"){return p}q=p.split(".");n=a;if(q.length===1&&m&&m[p]){return m[p]}for(o=0,k=q.length;o<k;o++){n=n[q[o]];if(n===b){return null}}if(j||n.namespace!==b){return n}return null},g=function(k,p,o){var r=typeof p==="boolean",n=r?p:false,q,j=(r?o:p)||{},q=k.split("."),s=q.pop(),m;if(!k.match(/^[A-Za-z0-9.]*$/)){return a5.ThrowError(100,null,{namespace:k})}m=q.length?f(q):a;if(m[s]!==b){return m[s]}return m[s]=n?new j():j},f=function(n){var m=a,k,j;for(k=0,j=n.length;k<j;k++){if(!m[n[k]]){m[n[k]]={}}m=m[n[k]]}return m},h=function(){e={};for(var j in a){e[j]=""}},d=function(j){if(!e){a5.ThrowError(101)}else{var m=[],k;for(k in a){if(e[k]===b){m.push(k)}}if(j===true){h()}return m}};a.a5={version:function(){return"0.5.{BUILD_NUMBER}"},buildDate:function(){return"{BUILD_DATE}"},GetNamespace:c,SetNamespace:g,TrackWindowStrays:h,GetWindowStrays:d,CreateGlobals:function(){a.Create=a5.Create;a.Package=a5.Package;a.GetNamespace=a5.GetNamespace;a.SetNamespace=a5.SetNamespace;a.ThrowError=a5.ThrowError}}})();a5.SetNamespace("a5.core.reflection",true,function(){var c={getName:function(){return this._a5_methodName},getClass:function(){return this._a5_ownerClass},getClassInstance:function(){return this._a5_ownerInstance},getAttributes:function(){return this._a5_attributes?this._a5_attributes:null}},d=function(e,g,h,f){f=f||g[h];f._a5_ownerInstance=g;f._a5_ownerClass=e;f._a5_methodName=h;f.getName=c.getName;f.getClass=c.getClass;f.getClassInstance=c.getClassInstance;f.getAttributes=c.getAttributes};return{setReflection:d}});a5.SetNamespace("a5.core.attributes",true,function(){var e=function(h,n){var r=Array.prototype.slice.call(n),o,B,A,z,y,s,p={},f=false;if(!r.length){return a5.ThrowError(305)}o=typeof r[r.length-1]==="function"?r.pop():null;if(o!==null&&typeof o!=="function"){return a5.ThrowError(300)}if(!r.length){return a5.ThrowError(301)}for(B=0,y=r.length;B<y;B++){var q=r[B];if(Object.prototype.toString.call(q)!=="[object Array]"){return a5.ThrowError(302)}for(A=0,z=q.length;A<z;A++){var w=q[A],s=typeof w;if(A==0){var C=false,x=null;if(s!=="string"){if(s==="function"){x=w}else{C=true}}else{var m=a5.GetNamespace(w,h.imports());if(!m){m=a5.GetNamespace(w+"Attribute",h.imports())}if(m){x=q[A]=m}else{C=true}}if(!C&&(!x.isA5||!x.doesExtend(a5.Attribute))){C=true}else{if(x.doesExtend(a5.AspectAttribute)){f=true}}if(C){return a5.ThrowError(303)}}else{if(s!=="object"||Object.prototype.toString.call(w)==="[object Array]"){return a5.ThrowError(304)}}}}for(B=0,y=r.length;B<y;B++){var g=r[B],v=[];for(var A=1,z=g.length;A<z;A++){v.push(g[A])}r[B]=[g[0],v];p[g[0].className()]=v}p.wrappedMethod=o;var u=function(){var F,k,D,N=[],J=this,F,H=0;if(o){for(var k in u){o[k]=u[k]}}D=u.caller;do{if(D.getClassInstance!==b){F=D}else{D=D.caller}}while(D!==null&&!F);for(var G=0,E=r.length;G<E;G++){var M=r[G][0],L=M.instance(true),K=r[G][1];N.push({cls:L,props:K})}var I=function(Q,P,O){t(H,Q,P,O)},t=function(V,S,P,O){if(S){if(Object.prototype.toString.call(S)!=="[object Array]"){S=[S]}}else{S=[]}if(!O){O=S}if(V>=N.length){if(P){return S[0]}else{return j(S,O)}}var R,P=P||false,Q=false,T=false,U=function(W){I.call(this,W||S,P,O)};R=N[V].cls.around(N[V].props,S,J,u,U,F,O);if(R===a5.AspectAttribute.NOT_IMPLEMENTED){R=N[V].cls[(P?"after":"before")](N[V].props,S,J,u,U,F,O)}else{Q=true}if(R!==null&&R!==b){switch(R){case a5.Attribute.SUCCESS:R=S;break;case a5.Attribute.ASYNC:T=true;break;case a5.Attribute.RETURN_NULL:R=null;break;case a5.Attribute.FAILURE:return}}else{return a5.ThrowError(308,null,{prop:k,method:Q?"around":(P?"after":"before")})}H=V+1;if(!T){return t(H,R,P,S,O)}},j=function(P,O){H=0;var Q=o?o.apply(J,P):b;if(Q!==b){Q=[Q]}else{Q=P}return t(0,Q,true,preArgs)};return t(H,Array.prototype.slice.call(arguments))};u._a5_attributes=p;return u},d=function(){for(i=0,l=a5.Attribute._extenderRef.length;i<l;i++){a5.Create(a5.Attribute._extenderRef[i])}},c=function(f){var g=f.getClass().getAttributes();return f};return{createAttribute:e,processInstance:c}});a5.SetNamespace("a5.core.classBuilder",true,function(){var p=[],u=false,g=[],o=[],c,k=function(w,v){var x,y;if(typeof w==="string"){x=a5.GetNamespace(w);if(x===null){return a5.ThrowError(207,null,{className:w})}}else{x=w}if(typeof x!=="function"){return a5.ThrowError(207,null,{className:w})}if(x.isInterface()){return a5.ThrowError(208,null,{nm:x.namespace()})}try{y=new x()}catch(z){return a5.ThrowError(209,null,{nm:typeof w==="string"?w:(w.namespace?w.namespace():""),errorStr:z})}if(x._a5_clsDef){s(x._a5_clsDef,y,y,x.imports(),x)}y._a5_initialize(v);return y},s=function(v,y,A,w,x,z){if(z){y.Properties=function(B){A.constructor._a5_protoProps=B};y.PrivateProperties=function(B){A.constructor._a5_protoPrivateProps=B;return function(C){return C._a5_privatePropsRef[A.namespace()]}}}y.Attributes=function(){return a5.core.attributes.createAttribute.call(A,y,arguments)};A.Override={};A.Final={};v.call(y,A,w,x);a5.core.mixins.prepareMixins(A);q(A);for(c in A){if(({}).hasOwnProperty.call(A,c)&&typeof A[c]==="function"&&a5.core.classProxyObj[c]===b){if(c===A.className()){A.constructor._a5_instanceConst=A[c];a5.core.reflection.setReflection(x,A,c,A.constructor._a5_instanceConst);delete A[c]}else{a5.core.reflection.setReflection(x,A,c)}}}delete A.Final;delete A.Override;delete y.Attributes;if(z){delete y.Properties;delete y.PrivateProperties}},q=function(x){var y=x.superclass(),v=x.constructor._a5_mixedMethods;if(!y){y={}}for(c in x){if(x.hasOwnProperty(c)&&typeof x[c]==="function"){if(c!=="Final"&&c!=="Override"&&c!=="constructor"&&c!=="prototype"&&c!=="dealloc"&&c!=="_a5_initialized"){if(y[c]&&y[c].toString().indexOf("[native code]")===-1){if(y[c].Final==true){return a5.ThrowError(201,null,{prop:c,namespace:x.namespace()})}return a5.ThrowError(200,null,{prop:c,namespace:x.namespace()})}else{var w=v[c];if(v[c]!==b&&w!==x[c]){return a5.ThrowError(220,null,{prop:c,namespace:x.namespace()})}}}}}for(c in x.Override){if(y[c]===b&&v[c]===b){return a5.ThrowError(202,null,{prop:c,namespace:x.namespace()})}if(y[c]&&y[c].Final===true||v[c]&&v[c].Final===true){return a5.ThrowError(203,null,{prop:c,namespace:x.namespace()})}x[c]=x.Override[c]}for(c in x.Final){x[c]=x.Final[c];x[c].Final=true}},n=function(z){var S,F,v,A,y,I,C,w,G=null,B=false,Q=false,D=false,M=false,L=false,H=function(){var V=e(S,z),X={pkg:z,imports:S,clsName:F,cls:v,base:A,attribs:G,type:y,proto:I,implement:C,mixins:w,staticMethods:B,isInterface:D,isMixin:Q,enumDeclaration:M,isProto:L},W=a5.core.verifiers.validateClassDependencies(A,V,w,C,D,Q);if(W===true){f(X)}else{p.push({pkg:X,reason:W.reason,reasonNM:W.reasonNM})}H=E=R=O=T=x=N=K=U=P=J=null},E=function(){S=Array.prototype.slice.call(arguments);return{Prototype:K,Static:T,Mixin:U,Mix:P,Extends:R,Implements:O,Interface:x,Class:N}},R=function(V){A=V;return{Prototype:K,Static:T,Import:E,Mix:P,Implements:O,Interface:x,Class:N}},P=function(){w=Array.prototype.slice.call(arguments);return{Prototype:K,Static:T,Extends:R,Implements:O,Interface:x,Class:N}},O=function(V){C=Array.prototype.slice.call(arguments);return{Prototype:K,Static:T,Mix:P,Import:E,Extends:R,Class:N}},T=function(V,W){if(typeof V==="string"){F=V;B=W;H()}else{B=V;return{Prototype:K,Implements:O,Mix:P,Mixin:U,Import:E,Extends:R,Class:N}}},x=function(W,V){F=W;v=V;D=true;H()},U=function(){Q=true;var W=Array.prototype.slice.call(arguments);F=W[0];for(var X=1,V=W.length;X<V;X++){switch(typeof W[X]){case"string":y=W[X];break;case"object":if(Object.prototype.toString.call(W[X])==="[object Array]"){G=W[X]}else{break}case"function":v=W[X];break}}H()},J=function(V,W){F=V;M=W;H()},N=function(){var W=Array.prototype.slice.call(arguments);F=W[0];for(var X=1,V=W.length;X<V;X++){switch(typeof W[X]){case"string":y=W[X];break;case"object":if(Object.prototype.toString.call(W[X])==="[object Array]"){G=W[X]}break;case"function":v=W[X];break}}H()},K=function(){L=true;var W=Array.prototype.slice.call(arguments);F=W[0];for(var X=1,V=W.length;X<V;X++){switch(typeof W[X]){case"string":y=W[X];break;case"object":if(Object.prototype.toString.call(W[X])==="[object Array]"){G=W[X]}else{break}case"function":I=W[X];break}}H()};a5.SetNamespace(z);return{Enum:J,Static:T,Import:E,Extends:R,Mixin:U,Mix:P,Implements:O,Class:N,Prototype:K,Interface:x}},r=function(G,B,I,x,E,M,P,v){if(E){if(B&&!B.isInterface()){return a5.ThrowError('Interface "'+G+'" cannot extend "'+B.namespace()+'", base class is not an interface.')}B=null}var w=function(){},C=M===false||false,Q=false,F=false,L=null,K=G.lastIndexOf("."),y=K>-1?G.substring(0,K):"",H=K>-1?G.substring(K+1):G,A,D,z,R,O,J;if(!B||B===b){B=w}D=function(){};if(x){A=x.split(/[ |]/);for(O=0,J=A.length;O<J;O++){if(A[O]=="final"){C=true}else{if(A[O]=="singleton"){Q=true}else{if(A[O]=="abstract"){F=true}}}}}if(a5.core.verifiers.checkNamespaceValid(G)){if(!B.isFinal||(B.isFinal()!=true)){if(B===Error){var N={};N.prototype=new B();D.prototype=N;N=null}else{D.prototype=new B()}L=B}else{return a5.ThrowError("Cannot extend "+B.namespace()+", class marked as final.")}}else{return a5.ThrowError("Cannot create new class in namespace "+G+", definition already exists.")}z=D.prototype;R=z.constructor=D;if(B.prototype.constructor._extenderRef){B.prototype.constructor._extenderRef.push(D)}R._a5_superclass=L;R._a5_pkg=y;R._a5_clsDef=I;R._a5_clsName=H;R._a5_namespace=G;R._a5_imports=P;R._a5_isFinal=C;R._a5_isAbstract=F;R._a5_isSingleton=Q;R._a5_isInterface=E;R._a5_isPrototype=M||false;R._mixinRef=B.prototype.constructor._mixinRef?B.prototype.constructor._mixinRef.slice(0):[];R._implementsRef=B.prototype.constructor._implementsRef?B.prototype.constructor._implementsRef.slice(0):[];R._a5_mixedMethods={};R._a5_instance=null;R._instanceCount=0;R._extenderRef=[];z._a5_initialized=false;for(c in a5.core.classProxyObj.construct){R[c]=a5.core.classProxyObj.construct[c]}if(B.namespace===b){for(c in a5.core.classProxyObj.instance){z[c]=a5.core.classProxyObj.instance[c]}}if(v){a5.core.mixins.applyMixins(z,v,P)}return a5.SetNamespace(G,D)},j=function(){var v=false,z,x;for(z=0;z<p.length;z++){var A=p[z].pkg,w=e(A.imports,A.pkg),y=a5.core.verifiers.validateClassDependencies(A.base,w,A.mixins,A.implement);if(y===true){f(A,true);p.splice(z,1);z--;v=true}else{p[z].reason=y.reason;p[z].reasonNM=y.reasonNM}}if(v){j()}},d=function(x){var w=x.obj,v=x.pkgObj;s(v.proto,w,w.prototype,w.imports(),w,true)},f=function(C,y){var v=function(){return e(C.imports,C.pkg)},w=(typeof C.base==="function")?C.base:a5.GetNamespace(C.base,v()),z=r(C.pkg+"."+C.clsName,w,C.cls,C.type,C.isInterface,C.isProto,v,C.mixins),D=y||false,G=true,A,x;if(C.staticMethods){C.staticMethods(z,v())}if(C.proto&&u){g.push({obj:z,pkgObj:C});if(C.implement){o.push({pkgObj:C,obj:z})}}else{if(C.proto){d({obj:z,pkgObj:C})}if(C.implement){G=a5.core.verifiers.validateImplementation(C,z)}}if(!G){return}if(C.enumDeclaration){var B=0,E=[];C.enumDeclaration({startIndex:function(H){B=H},addValue:function(H){E.push(H)}});for(A=0,x=E.length;A<x;A++){z[E[A]]=B++}z.addValue=function(H){if(z[H]===b){z[H]=B++}};z.getValue=function(H){for(c in z){if(z[c]===H){return c}}return null}}if(C.isInterface){z.interfaceVals={};if(C.base!==null&&C.base!==b){var F=a5.GetNamespace(C.base,z.imports());if(F.isInterface()){for(c in F.interfaceVals){if(z.interfaceVals[c]===b){z.interfaceVals[c]=F.interfaceVals[c]}}}else{a5.ThrowError(204,null,{objNM:z.namespace(),clsNM:F.namespace()})}}C.cls.call(z.interfaceVals,z.interfaceVals)}if(C.isMixin){z._mixinDef={Properties:function(H){z.prototype.constructor._a5_mixinProps=H},Contract:function(H,I){return a5.core.contracts.createContract(H,I)},MustExtend:function(){z.prototype.constructor._a5_mixinMustExtend=arguments},MustMix:function(){z.prototype.constructor._a5_mixinMustMix=arguments}};C.cls.call(z._mixinDef,z._mixinDef,z.imports(),z);if(typeof z._mixinDef[z.className()]==="function"){z._a5_instanceConst=z._mixinDef[z.className()];delete z._mixinDef[z.className()]}else{a5.ThrowError(205,null,{nm:z.namespace()})}delete z._mixinDef.Properties;delete z._mixinDef.Contract;delete z._mixinDef.MustExtend;delete z._mixinDef.MustMix}if(!D){j()}},e=function(x,w,v){return(function(F,H){var C={},y=v||false,z=[],E,B,G=function(J){var K;for(c in J){K=J[c];if((typeof K==="function"||typeof K==="object")&&C[c]===b){C[c]=K}}};C.rebuild=function(){if(z.length){var K={},M=e(z,null,true),J=M.retObj,L=M.rebuildArray;for(c in C){K[c]=C[c]}for(c in J){if(K[c]===b){C[c]=K[c]=J[c]}}z=L;return K}else{return C}};if(H){G(a5.GetNamespace(H,null,true))}if(F){var I,H,A;for(E=0,B=F.length;E<B;E++){I=F[E],isWC=false,dotIndex=I.lastIndexOf(".");if(I.charAt(I.length-1)=="*"){isWC=true}if(isWC){H=a5.GetNamespace(I.substr(0,I.length-2),null,true);if(H){G(H)}else{z.push(I)}}else{A=dotIndex>-1?I.substr(dotIndex+1):I;var D=a5.GetNamespace(I,null,true);if(D){if(C[A]===b){C[A]=D}}else{z.push(I)}}}}if(y){return{retObj:C,rebuildArray:z}}return C})(x,w)},h=function(){if(p.length){var x="",w,v;for(w=0,v=p.length;w<v;w++){x+='"'+p[w].pkg.pkg+"."+p[w].pkg.clsName+'", '+p[w].reason+' class missing: "'+p[w].reasonNM+'"'+(p.length>1&&w<p.length-1?", \n":"")}a5.ThrowError(206,null,{classPlural:p.length==1?"class":"classes",clsString:x})}},t=function(v){u=v},m=function(){for(var w=0,v=g.length;w<v;w++){d(g[w])}g=[];for(w=0,v=o.length;w<v;w++){a5.core.verifiers.validateImplementation(o[w].pkgObj,o[w].obj)}o=[]};return{Create:k,Package:n,_a5_processImports:e,_a5_processImports:e,_a5_verifyPackageQueueEmpty:h,_a5_delayProtoCreation:t,_a5_createQueuedPrototypes:m}});a5.Create=a5.core.classBuilder.Create;a5.Package=a5.core.classBuilder.Package;a5._a5_processImports=a5.core.classBuilder._a5_processImports;a5._a5_verifyPackageQueueEmpty=a5.core.classBuilder._a5_verifyPackageQueueEmpty;a5._a5_delayProtoCreation=a5.core.classBuilder._a5_delayProtoCreation;a5._a5_createQueuedPrototypes=a5.core.classBuilder._a5_createQueuedPrototypes;a5.SetNamespace("a5.core.classProxyObj",{construct:{classPackage:function(c){return c?a5.GetNamespace(this._a5_pkg,null,true):this._a5_pkg},className:function(){return this._a5_clsName},namespace:function(){return this._a5_namespace},imports:function(){return this._a5_imports?this._a5_imports():{}},doesImplement:function(c){return a5.core.verifiers.checkImplements(this,c)},doesExtend:function(c){return a5.core.verifiers.checkExtends(this,c)},doesMix:function(c){return a5.core.verifiers.checkMixes(this,c)},getAttributes:function(){return this._a5_attributes},instance:function(d,c){if(d===true){return this._a5_instance||a5.Create(this,c)}else{return this._a5_instance}},superclass:function(e,c){if(e!==b){if(typeof e==="object"&&e.isA5===true){if(typeof c!=="object"){c=[]}if(!this._a5_superclass.className){return a5.ThrowError(210)}var d=this._a5_superclass.prototype.constructor._a5_instanceConst;if(d){d.apply(e,c)}else{a5.ThrowError(211,null,{nm:this._a5_superclass.className()})}}else{a5.ThrowError(212,null,{nm:this.namespace()})}}else{return this._a5_superclass.prototype}},instanceCount:function(){return this._instanceCount},isInterface:function(){return this._a5_isInterface},isFinal:function(){return this._a5_isFinal},isSingleton:function(){return this._a5_isSingleton},isAbstract:function(){return this._a5_isAbstract},isPrototype:function(){return this._a5_isPrototype},isA5ClassDef:function(){return true},isA5:true},instance:{isA5:true,isA5ClassDef:function(){return false},getStatic:function(){return this.constructor},autoRelease:function(d){if(d!==b){var e=new Date().getTime(),c=this;this._a5_ar[e]=d;return function(){return c._a5_ar[e]}}},superclass:function(d,c){return this.constructor.superclass(d,c)},mixins:function(c){if(c!==b){return GetNamespace(c,this.imports())}else{return this.constructor._a5_mixedMethods}},mix:function(c){a5.core.mixins.applyMixins(this,c,this.imports(),this)},getAttributes:function(){return this.constructor.getAttributes()},getAttributeValue:function(c){return this.constructor.getAttributeValue(c)},getMethods:function(d,e){var c=[];for(var f in this){if((d||({}).hasOwnProperty.call(this,f))&&typeof(this[f])==="function"&&a5.core.classProxyObj.instance[f]===b&&f.substr(0,4)!=="_a5_"&&(e||f.substr(0,1)!=="_")){c.push(f)}}return c},getProperties:function(d,f){var c=[],e=function(k,m){var h=k;while(h!==null){if(h.constructor._a5_protoProps!==b){var j={};h.constructor._a5_protoProps.call(j);if(j[m]!==b){return true}}h=h.constructor.superclass&&h.constructor.superclass().constructor.namespace?h.constructor.superclass():null}return false};for(var g in this){if((d||!e(this,g))&&typeof(this[g])!=="function"&&a5.core.classProxyObj.instance[g]===b&&g.substr(0,4)!=="_a5_"&&(f||g.substr(0,1)!=="_")){c.push(g)}}return c},classPackage:function(){return this.constructor.classPackage()},className:function(){return this.constructor.className()},getClass:function(){return this.constructor},namespace:function(){return this.constructor.namespace()},doesImplement:function(c){return this.constructor.doesImplement(c)},doesExtend:function(c){return this.constructor.doesExtend(c)},doesMix:function(c){return this.constructor.doesMix(c)},imports:function(){return this.constructor.imports()},dealloc:function(){},instanceCount:function(){return this.constructor.instanceCount()},isInterface:function(){return this.constructor.isInterface()},isFinal:function(){return this.constructor.isFinal()},isSingleton:function(){return this.constructor.isSingleton()},isAbstract:function(){return this.constructor.isAbstract()},isPrototype:function(){return this.constructor.isAbstract()},instanceUID:function(){return this._a5_instanceUID},destroy:function(){if(this._a5_initialized===true){if((this.namespace()==="a5.cl.CL"||this.classPackage().indexOf("a5.cl.core")!==-1)&&!this.classPackage()==="a5.cl.core.viewDef"){a5.ThrowError(215,null,{nm:this.namespace()});return}this._a5_initialized=false;var g=this,h,e,c,j,f,d;while(g!==null){c=g.constructor._mixinRef;if(c&&c.length){for(f=0,d=c.length;f<d;f++){if(c[f]._mixinDef.dealloc!=b){c[f]._mixinDef.dealloc.call(this)}}}if(g.constructor.namespace){e=g.constructor.superclass?g.constructor.superclass():null;if(e&&e.dealloc!==g.dealloc){g.dealloc.call(this)}g=e}else{g=null}}if(this.constructor._a5_instance===this){this.constructor._a5_instance=null}for(j in this._a5_ar){delete this._a5_ar[j]}for(j in this){if(({}).hasOwnProperty.call(this,j)&&typeof this.constructor.prototype[j]==="undefined"&&j!=="_a5_initialized"&&j!=="_a5_instanceUID"){this[j]=null}}}},_a5_initialize:function(j){if(!this._a5_initialized){if(this.constructor.isAbstract()&&this._a5_initialize.caller.caller!==Extend){return a5.ThrowError(216,null,{nm:this.constructor.namespace()})}this._a5_initialized=true;if(this.constructor.isSingleton()&&this.constructor._a5_instance!==null){return a5.ThrowError(217,null,{nm:this.constructor.namespace()})}this._a5_instanceUID=this.namespace().replace(/\./g,"_")+"__"+this.constructor.instanceCount();if(this.instanceCount()===0){this.constructor._a5_instance=this}this.constructor._instanceCount++;this._a5_ar={};var k=this,c=this,e=j||[],m=[],g,f,d,h;this._a5_privatePropsRef={};if(typeof this.constructor._a5_instanceConst!=="function"){return a5.ThrowError(218,null,{clsName:this.className()})}while(c!==null){if(c.constructor._a5_protoPrivateProps!==b){this._a5_privatePropsRef[c.namespace()]={};c.constructor._a5_protoPrivateProps.call(this._a5_privatePropsRef[c.namespace()])}if(c.constructor._a5_protoProps!==b){m.unshift(c.constructor._a5_protoProps)}c=c.constructor.superclass&&c.constructor.superclass().constructor.namespace?c.constructor.superclass():null}a5.core.mixins.initializeMixins(this);for(f=0,d=m.length;f<d;f++){m[f].call(this)}this.constructor._a5_instanceConst.apply(this,e);a5.core.mixins.mixinsReady(this);return true}else{return null}},create:a5.Create,throwError:function(){return a5.ThrowError.apply(this,arguments)},assert:function(d,c){if(d!==true){throw this.create(a5.AssertException,[c])}}}});a5.SetNamespace("a5.core.verifiers",{namespaceArray:[],validateImplementation:function(n,g){var h,f,c,j,s,o,m,d=function(t,e){for(var u in t){if(t[u]!==e[u]){return false}}return true};for(h=0,f=n.implement.length;h<f;h++){j=n.implement[h];try{s=new g;s.Override={};s.Final={};s.Attributes=function(){var u=Array.prototype.slice.call(arguments);var w=u.pop();for(var v=0,t=u.length;v<t;v++){var e=u[v][0];if(e==="Contract"||e==="ContractAttribute"||e===ar.ContractAttribute){w.attributes=u[v]}}return w};o=a5.GetNamespace(j,g.imports());if(g._a5_clsDef){g._a5_clsDef.call(s,s,g.imports(),g)}}catch(k){throw k;return false}if(!o.isInterface()){return a5.ThrowError(213,null,{implNM:o.namespace(),objNM:g.namespace()})}for(c in o.interfaceVals){m=s[c]!==b;var r=o.interfaceVals[c],p=s[c];if(m&&typeof r==="object"&&p.attributes&&(p.attributes[0]==="Contract"||p.attributes[0]==="ContractAttribute"||p.attributes[0]===a5.ContractAttribute)){var q=true;for(var h=0,f=r.length;h<f;h++){q=q&&p.attributes.length>=(h+1)?d(r[h],p.attributes[h+1]):false}if(!q){return a5.ThrowError(601,null,{intNM:o.namespace(),implNM:g.namespace(),method:c})}}else{if(!m||(m&&typeof o.interfaceVals[c]!==typeof s[c])){return a5.ThrowError(214,null,{implNM:o.namespace(),objNM:g.namespace()})}}}g._implementsRef.push(o);s.destroy()}return true},checkNamespaceValid:function(e){for(var d=0,c=this.namespaceArray.length;d<c;d++){if(this.namespaceArray[d]==e){return false}}this.namespaceArray.push(e);return true},checkImplements:function(d,m){if(typeof m==="string"){m=a5.GetNamespace(m)}var h=d._implementsRef,g,f,e,c;while(h){for(g=0,c=h.length;g<c;g++){if(h[g]===m){return true}}h=d.superclass()?d.superclass().getStatic()._implementsRef:null}return false},checkExtends:function(c,f){var e=c._a5_superclass&&c._a5_superclass.prototype.className?c._a5_superclass:null;if(!e){return false}var d=(typeof f==="string")?a5.GetNamespace(f):f;if(!d){return false}while(e){if(e===d){return true}e=e._a5_superclass&&e._a5_superclass.prototype.className?e._a5_superclass:null}return false},checkMixes:function(d,f){if(typeof f==="string"){f=a5.GetNamespace(f)}if(!f){return false}for(var e=0,c=d._mixinRef.length;e<c;e++){if(d._mixinRef[e]===f){return true}}return false},validateClassDependencies:function(e,q,o,d,f,r){var p,k,n,j=null,c,g,s,h;if(e!==b){if(typeof e==="function"){j=e}else{j=a5.GetNamespace(e,q)}}p=true;if(e!==b&&!j){p=false;k="base";n=e}if(p&&o!==b){for(c in o){g=o[c];if(typeof g==="string"){s=a5.GetNamespace(g,q)}if(typeof s!=="function"){p=false;k="mixin";n=g}}}if(p&&d!==b){for(c in d){h=d[c];if(typeof h==="string"){s=a5.GetNamespace(h,q)}if(typeof s!=="function"){p=false;k="interface";n=h}}}return p?true:{reason:k,reasonNM:n}}});a5.SetNamespace("a5.core.mixins",{prepareMixins:function(h){var g=h,c=h.constructor._mixinRef,f,e,j,d;if(c.length){for(f=c.length-1,e=-1;f>e;f--){if(c[f]._a5_mixinMustExtend!==b){for(j in c[f]._a5_mixinMustExtend){d=c[f]._a5_mixinMustExtend[j];if(!h.doesExtend(a5.GetNamespace(d,h.imports()))){return a5.ThrowError(400,null,{nm:c[f].namespace()})}}}}}},initializeMixins:function(h){var g=h,c=h.constructor._mixinRef,f,e,j,d;if(c.length){for(f=c.length-1,e=-1;f>e;f--){if(c[f]._a5_mixinProps!==b){c[f]._a5_mixinProps.call(g)}}for(f=0,e=c.length;f<e;f++){c[f]._a5_instanceConst.call(g)}}},mixinsReady:function(g){var c=g.constructor._mixinRef,f,e,h,d;if(c.length){for(f=c.length-1,e=-1;f>e;f--){if(c[f]._a5_mixinMustMix!==b){for(h in c[f]._a5_mixinMustMix){d=c[f]._a5_mixinMustMix[h];if(!inst.doesMix(a5.GetNamespace(d))){return a5.ThrowError(401,null,{nm:c[f].namespace(),cls:d})}}}if(typeof c[f]._mixinDef.mixinReady==="function"){c[f]._mixinDef.mixinReady.call(g)}}}},applyMixins:function(k,j,d,h){var e={},j=typeof j==="string"?[j]:j,m=[],g,f,n;for(g=0,f=j.length;g<f;g++){n=a5.GetNamespace(j[g],typeof d==="function"?d():d);if(!n){return a5.ThrowError(404,null,{mixin:j[g]})}m.push(n);for(g=0;g<k.constructor._mixinRef.length;g++){if(k.constructor._mixinRef[g]===n){return a5.ThrowError(402,null,{nm:n.namespace()})}}for(var c in n._mixinDef){if(c!=="dealloc"&&c!=="Properties"&&c!=="mixinReady"&&c!=="MustExtend"&&c!=="Contract"){if(e[c]===b){if(h===b){k.constructor._a5_mixedMethods[c]=n._mixinDef[c]}k[c]=n._mixinDef[c];e[c]="mixed"}else{return a5.ThrowError(403,null,{method:c})}}}if(h){a5.core.mixins.initializeMixins(h,m,h)}else{k.constructor._mixinRef.push(n)}}}});a5.SetNamespace("a5.core.errorHandling",true,function(){var d=null;this.ThrowError=function(e,h,g){var f=typeof e,j;if(f==="string"){j=e}else{if(f==="number"){if(a5.GetNamespace("a5.ErrorDefinitions",null,true)){var j=a5.ErrorDefinitions[e];if(!j){j="Invalid error id "+e+" thrown: error not defined."}}else{j="Error id "+e+" thrown. Include a5.ErrorDefinitions for verbose information."}e=a5.Create(h||a5.Error,[j,a5.Error.FORCE_CAST_ERROR])}}if(j){e=a5.Create(h||a5.Error,[(g?c(j,g):j),a5.Error.FORCE_CAST_ERROR])}d=e;throw e};this._a5_getThrownError=function(){var e=d;d=null;return e};var c=function(f,e){for(var g in e){f=f.replace(new RegExp("{"+g+"}","g"),e[g])}return f}});a5.ThrowError=a5.core.errorHandling.ThrowError;a5._a5_getThrownError=a5.core.errorHandling._a5_getThrownError;a5.Package("a5").Prototype("Attribute","singleton",function(e,c,d){e.Attribute=function(){}});a5.Package("a5").Static("AttributeTarget",function(c){c.ALL="_a5_attrTargAll";c.METHOD="_a5_attrTargMethod";c.CLASS="_a5_attrTargClass"});a5.Package("a5").Extends("Attribute").Prototype("AspectAttribute",function(e,d,c){c.RETURN_NULL="_a5_aspectReturnsNull";c.SUCCESS="_a5_aspectSuccess";c.ASYNC="_a5_aspectAsync";c.FAILURE="_a5_aspectFailure";c.NOT_IMPLEMENTED="_a5_notImplemented";e.AspectAttribute=function(){e.superclass(this)};e.before=function(){return c.NOT_IMPLEMENTED};e.after=function(){return c.NOT_IMPLEMENTED};e.around=function(){return c.NOT_IMPLEMENTED}});a5.Package("a5").Extends("AspectAttribute").Class("ContractAttribute",function(d,c,g){d.ContractAttribute=function(){d.superclass(this)};d.Override.before=function(o,k,m,r,q){var n=null,p=false,j=function(s){s.message='Contract type failure on method "'+r.getName()+'" '+s.message;return s};if(o.length>1){for(i=0,l=o.length;i<l;i++){n=e(o[i],k);if(n instanceof a5.ContractException){d.throwError(j(n));return a5.AspectAttribute.FAILURE}if(n!==false){p=true;n.overloadID=i;break}}}else{p=true;n=e(o[0],k,true);if(n instanceof a5.ContractException){d.throwError(j(n));return a5.AspectAttribute.FAILURE}}if(!p||n===false){d.throwError(j(d.create(a5.ContractException,["no matching overload found"])));return a5.AspectAttribute.FAILURE}else{return n}};var e=function(p,k){var o={},n=0,j,q,m;for(q in p){m=p[q];j=h((n<k.length?k[n]:b),m,n);if(j instanceof a5.ContractException){return j}o[q]=j;n++}if(k.length>n){return false}if(k.length===0){if(n===0){return o}return false}return o},h=function(k,p,q){var o="type",m=false,r=null,n,j;if(p.indexOf("=")!=-1){n=p.split("=");p=n[0];m=true;r=n[1]}else{if(m){return d.create(a5.ContractException,["for argument "+q+", required values cannot be defined after optional values"])}}if(p.indexOf(".")!==-1){o="class"}if(p==="array"){o="array"}if(p==="object"){o="object"}if(o!=="class"){p=p.toLowerCase()}if(k===b){if(m){k=f(p,o,r,q)}else{return d.create(a5.ContractException,["for argument "+q+', missing required argument of type "'+p+'"'])}}if(k!==b&&k!==null){switch(o){case"class":j=a5.GetNamespace(p);if(j.isInterface()){if(!(k.doesImplement(j))){return d.create(a5.ContractException,["for argument "+q+", must implement interface "+p])}}else{if(!(k instanceof j)){return d.create(a5.ContractException,["for argument "+q+", must be an instance of type "+p])}}break;case"type":if(k!==null&&typeof k!==p){return d.create(a5.ContractException,["for argument "+q+", must be of type "+p])}break;case"array":if(Object.prototype.toString.call(k)!=="[object Array]"){return d.create(a5.ContractException,["for argument "+q+", must be an array"])}break;case"object":if(k._a5_initialized!==b||typeof k!=="object"||k instanceof Array){return d.create(a5.ContractException,["for argument "+q+", must be a generic object"])}break}}return k},f=function(k,j,q,m){var p,o=false;if(k==="string"){var n=q.charAt(0);if(n===q.charAt(q.length-1)){if(n==='"'||n==="'"){p=q.substr(1,q.length-2)}else{o=true}}else{o=true}}else{if(k==="number"){if(!isNaN(q)){p=parseInt(q)}else{o=true}}else{if(j==="class"){if(q==="null"){p=null}else{o=true}}else{if(k==="boolean"||k==="array"||k==="function"||k==="object"){switch(q){case"{}":if(k==="object"){p={}}else{o=true}break;case"[]":if(k==="array"){p=[]}else{o=true}break;case"null":p=null;break;case"true":if(k==="boolean"){p=true}else{o=true}break;case"false":if(k==="boolean"){p=false}else{o=true}break;default:o=true}}else{o=true}}}}if(o){return d.create(a5.ContractException,["for argument "+m+', invalid default value for data type "'+k+'"'])}else{return p}}});a5.Package("a5").Extends("AspectAttribute").Class("PropertyMutatorAttribute",function(c){c.PropertyMutatorAttribute=function(){c.superclass(this)};c.Override.before=function(n,h,o,d,k,g){if(h.length){var f=n[0].validate,j=false;if(f){if(f.indexOf(".")!==-1){j=true;var f=a5.GetNamespace(f);if(!f){return a5.AspectAttribute.FAILURE}}var m=j?(h[0] instanceof f):(typeof h[0]===f);if(!m){return a5.AspectAttribute.FAILURE}}o[n[0].property]=h[0];return a5.AspectAttribute.SUCCESS}var e=o[n[0].property]||null;return e===null?a5.AspectAttribute.RETURN_NULL:e};c.Override.after=function(h,d,e,k,j,f,g){if(g.length){return e}else{return a5.AspectAttribute.SUCCESS}}});a5.Package("a5").Static(function(c){c.DESTROYED="Destroyed"}).Prototype("Event",function(c){c.Event=function(d,f,e){this._a5_type=d;this._a5_data=e;this._a5_target=null;this._a5_currentTarget=null;this._a5_phase=1;this._a5_bubbles=f!==false;this._a5_canceled=false;this._a5_cancelPending=false;this._a5_shouldRetain=false};c.cancel=function(d){if(d===true){this._a5_cancelPending=true}else{this._a5_canceled=true}};c.target=function(){return this._a5_target};c.currentTarget=function(){return this._a5_currentTarget};c.type=function(){return this._a5_type};c.data=function(){return this._a5_data};c.phase=function(){return this._a5_phase};c.bubbles=function(){return this._a5_bubbles};c.shouldRetain=function(d){if(typeof d==="boolean"){this._a5_shouldRetain=d;return this}return this._a5_shouldRetain};c.dealloc=function(){this._a5_target=this._a5_currentTarget=null}});a5.Package("a5").Static("EventPhase",function(c){c.CAPTURING=1;c.AT_TARGET=2;c.BUBBLING=3});a5.Package("a5").Extends(Error).Prototype("Error",function(d,c,e){e.FORCE_CAST_ERROR="_a5_forceCastError";this.Properties(function(){this.stack=[];this.message="";this._a5_isWindowError=false;this.name=this.type=this.className()});d.Error=function(m,g){if(g===false){this._a5_isWindowError=true}if(typeof m==="string"){this.message=m}else{g=m}if(g instanceof e){if(g.stack){this.stack=g.stack.split("\n")}this.line=g.lineNumber;this.url=g.fileName;if(g.message&&this.message===""){this.message=g.message}}else{if(g!==false){try{__undefined__()}catch(n){if(n.stack){var f=n.stack.indexOf("@http")!==-1;this.stack=n.stack.split("\n");this.stack=this.stack.splice(4);if(f){for(var j=0;j<this.stack.length;j++){this.stack[j]=this.stack[j].substr(this.stack[j].indexOf("@http"))}}}else{var k=[];try{var j=0,h=this.init.caller.caller.caller;do{for(j=0,l=k.length;j<l;j++){if(k[j]===h){h=null}}if(h){if(h.toString().indexOf(e.FORCE_CAST_ERROR)===-1){this.stack.push(h.toString().replace(/;/g,";<br/>").replace(/{/g,"{<br/>").replace(/}/g,"}<br/>")+"<br/><br/>")}k.push(h);h=h.caller;j++}}while(h&&j<=50)}catch(n){}}}}}};d.isWindowError=function(){return this._a5_isWindowError};d.Override.toString=function(){return this.type+": "+this.message}});a5.Package("a5").Extends("Error").Prototype("AssertException",function(c){c.AssertException=function(){c.superclass(this,arguments);this.type="AssertException"}});a5.Package("a5").Extends("Error").Prototype("ContractException",function(c){c.ContractException=function(){c.superclass(this,arguments);this.type="ContractException"}});a5.Package("a5").Prototype("EventDispatcher","abstract",function(c){this.Properties(function(){this._a5_autoPurge=false;this._a5_listeners={}});c.EventDispatcher=function(){};c.autoPurge=function(d){if(typeof d==="boolean"){this._a5_autoPurge=d;return this}return this._a5_autoPurge};c.addEventListener=function(f,g,d,e){this._a5_addEventListener(f,g,d,e)};c.addOneTimeEventListener=function(f,g,d,e){this._a5_addEventListener(f,g,d,e,true)};c.hasEventListener=function(o,d){var n=o.split("|"),p=this.cl(),k,g,f,h,e;for(k=0,g=n.length;k<g;k++){f=this._a5_getListenerArray(n[k]);if(f){for(h=0,e=f.length;h<e;h++){if(f[h].type==n[k]&&(typeof d==="function"?(f[h].method==d):true)){return true}}}}return false};c.removeEventListener=function(p,d,e){var o=p.split("|"),n,h,g,k,f;e=e===true;for(n=0,h=o.length;n<h;n++){g=this._a5_getListenerArray(o[n]);if(g){for(k=0,f=g.length;k<f;k++){if(g[k].method==d&&g[k].type==o[n]&&g[k].useCapture===e){g.splice(k,1);f=g.length}}this.eListenersChange({type:o.length>1?o:o[0],method:d,useCapture:e,changeType:"REMOVE"})}}};c.removeAllListeners=function(){if(this._a5_listeners){this._a5_listeners={}}};c.getTotalListeners=function(e){if(typeof e==="string"){var d=this._a5_getListenerArray(e);if(d){return d.length}else{return 0}}else{var f=0;for(var g in this._a5_listeners){f+=this._a5_listeners[g].length}return f}};c.dispatchEvent=function(f,g,d){var h=this._a5_createEvent(f,g,d);h._a5_phase=a5.EventPhase.AT_TARGET;this._a5_dispatchEvent(h);if(!h.shouldRetain()){h.destroy()}h=null};c.eListenersChange=function(d){};c._a5_addEventListener=function(r,d,f,s,t){var u=s||null,q=r.split("|"),n=t||false,e=true,p,k,h,o,g;if(q.length!=0&&d!=b){for(p=0,k=q.length;p<k;p++){h=this._a5_getListenerArray(q[p],true);for(o=0,g=h.length;o<g;o++){if(h[o].method===d&&h[o].type===q[p]&&h[o].useCapture===f){e=false;break}}if(e){h.push({type:q[p],method:d,scope:u,useCapture:f===true,isOneTime:n})}}this.eListenersChange({type:q.length>1?q:q[0],method:d,changeType:"ADD"})}else{throw"invalid listener: type- "+r+", method- "+d}};c._a5_createEvent=function(f,g,d){var h=(typeof f==="string")?a5.Create(a5.Event,[f,d]):f;if(h instanceof a5.Event||h.doesExtend&&h.doesExtend(a5.Error)){h._a5_target=this;if(g){h._a5_data=g}return h}throw"Invalid event type."};c._a5_dispatchEvent=function(j){j._a5_currentTarget=this;if(this._a5_listeners){var k=this._a5_getListenerArray(j.type()),g,d,f,h;if(k){for(g=0,d=k.length;g<d;g++){f=k?k[g]:null;if(j._a5_canceled||!f){return}h=(j.phase()===a5.EventPhase.CAPTURING&&f.useCapture)||(j.phase()!==a5.EventPhase.CAPTURING&&!f.useCapture),validListener=typeof f.method==="function"&&(f.scope&&f.scope.namespace?f.scope._a5_initialized:true);if(h&&validListener){f.method.call(f.scope,j)}if(f.isOneTime===true||(!validListener&&this._a5_autoPurge)){k.splice(g,1);g--;d--}}}}};c._a5_getListenerArray=function(e,d){if(this._a5_listeners[e]===b){if(d===true){this._a5_listeners[e]=[];return this._a5_listeners[e]}return null}return this._a5_listeners[e]};c.dealloc=function(){this.dispatchEvent(a5.Create(a5.Event,[a5.Event.DESTROYED]));this.removeAllListeners();this._a5_listeners=null}});a5.SetNamespace("a5.ErrorDefinitions",{100:'invalid namespace "{namespace}", namespaces must contain only letters, numbers, or periods.',101:"TrackWindowStrays must be called prior to GetWindowStrays.",200:'Invalid attempt to define new method "{prop}" in class "{namespace}", without calling override, method exists in superclass.',201:'Invalid attempt to override method "{prop}" in class "{namespace}", method marked as Final in superclass.',202:'Invalid attempt to override method "{prop}" in class "{namespace}", method not defined in superclass.',203:'Invalid attempt to override method "{prop}" in class "{namespace}", method marked as Final in superclass.',204:'Interface "{objNM}" cannot extend the non interface class "{clsNM}"',205:'Mixin "{nm}" doesn not specify a constructor.',206:"Class definitions not found for the following expected {classPlural}: \n {clsString}",207:"Error creating new class instance: cannot find object {className}.",208:"Cannot instantiate class {nm} , interfaces must be associated by the Implements directive.",209:"Error creating class instance {nm} ({errorStr})",210:"Superclass called on an object without a superclass.",211:'Constructor not defined on class "{nm}"',212:'invalid scope argument passed to superclass constructor on class "{nm}".',213:'Cannot implement "{implNM}" on class "{objNM}", class is not an interface.',214:'Invalid implementation of interface "{implNM}" , on class "{objNM}".',215:'Destroy called on core object "{nm}"',216:'Cannot directly instantiate class "{nm}", class marked as abstract.',217:'Cannot create new instance of class "{nm}", class marked as singleton already exists.',218:'Constructor not defined on class "{clsName}"',219:'Class "{currClass}" requires "{checkedClass}"',220:'Invalid attempt to define new method "{prop}" in class "{namespace}", without calling override, method exists in mixin.',300:'Invalid attribute definition: "Attributes" call must take a function as its last parameter.',301:"Invalid attribute definition: No attributes were defined.",302:"Attribute error: Attributes call accepts only arrays as attribute annotations.",303:"Attribute error: First parameter must be a reference to a class that extends a5.Attribute.",304:"Attribute error: invalid parameter specified for Attribute, params must be key/value pair objects.",305:"Attribute error: no parameters passed to Attribute call.",308:'Error processing attribute "{prop}", "{method}" must return a value.',400:'invalid scope argument passed to superclass constructor on class "{nm}".',401:'Mixin "{nm}" requires owner class to mix "{cls}".',402:'Mixin "{nm}" already mixed into ancestor chain.',403:'Invalid mixin: Method "{method}" defined by more than one specified mixin.',404:'Invalid mixin: Mixin "{mixin}" does not exist.',601:"Invalid implementation of Contract on interace {intNM} in class {implNM} for method {method}."})})(this);
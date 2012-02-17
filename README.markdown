![Test Pilot One Eleven](http://testpilot111.com/images/logo_black_250.png)


![A5](http://testpilot111.com/images/A5_logo_bevel_70.png) 


A5 - OOP/AOP Language Enhancement pack for JavaScript

Licensed under GPL-3.0

Detailed release notes coming soon, along with wiki implementation guides.

A5 Framework modules to be open sourced soon alongside A5 on GitHub. 

A5 provides:

- Classes and packages (leverages prototype)
- Interfaces
- Enums
- Mixins
- Custom Errors
- Events and Dispatching
- Reflection
- Import statements
- Static members
- Override and Final method declarations
- Singleton, Abstract, and Final class declarations
- Proper constructors and super references
- Destroy/dealloc methods
- Method attributes/meta
- Aspect oriented principles (before/after/around) for methods
- Strict argument validation via Contracts


Validated on:
 IE 5.5+
 FF2+
 Chrome
 Safari 3.2+
 
 Quick tutorial: Hello World
 
```javascript

a5.Package('sampleApp')

	.Class('HelloWorld', function(cls){
		
		cls.HelloWorld = function(){
			alert('Hello World!');
		}
})

a5.Create(sampleApp.HelloWorld);
 
```
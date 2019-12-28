const express =    		require('express'),
	  methodOverride = require('method-override'),
	  app =    			express(),
	  bodyParser =   	 require('body-parser'),
	  sanitizer=        require('express-sanitizer'),
	  mongoose =    	require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog_app',{useUnifiedTopology:true, useNewUrlParser: true})
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(sanitizer());
// Schema setup
const blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
const Blog= mongoose.model("Blog",blogSchema);
// REST routes setup.
// No route will resirect to home page
app.get('/',async(req,res)=>{
	res.redirect('/blogs');
});
// Home page route
app.get('/blogs',async(req,res)=>{
	Blog.find({},(err,blogs)=>{	
		if(err){
			console.error('ERROR',err);
		}else{
			res.render('index',{blogs:blogs});
		}
	});		
});
//Get New post form route
app.get('/blogs/new',async(req,res)=>{
	res.render('new')
});
// Post the new post route
app.post('/blogs',async(req,res)=>{
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,(err,newBlog)=>{
		if(err){
		 console.error('ERROR',err);
			res.render('new');
		}else{
			  res.redirect('/blogs');
		 	}
		})
	});
// Show more route
app.get('/blogs/:id',async(req,res)=>{
		Blog.findById(req.params.id, (err,foundBlog)=>{
			if(err){
				res.redirect('/blogs');
				console.error('ERROR',err);
			}else{
				res.render('show',{blog:foundBlog})
			}
		});
	});
// Get edit post form route
app.get('/blogs/:id/edit', async(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect('/blogs');
			console.error('ERROR',err);
		}else{
			res.render('edit',{blog:foundBlog})
		}
	});
});
// Update post on db
app.put('/blogs/:id',async(req,res)=>{
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updated)=>{
		if(err){
			console.error('ERROR',err);
		}else{
			res.redirect('/blogs');
		}
	});
});

app.delete('/blogs/:id',async(req,res)=>{
	console.log(req.params.id)
	Blog.deleteOne({_id:req.params.id},(err,deleted)=>{
		if(err){
			console.error('ERROR',err);
		}else{
		res.redirect('/blogs');
		}
	})
})
app.listen(3000,()=>{
	console.log('Listening on port 3000')
})
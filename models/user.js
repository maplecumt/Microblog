var mongodb=require('./db');

function User(user){
	this.name=user.name;
	this.password=user.password;
};
module.exports=User;

User.prototype.save = function(callback){
	/* 存入mongodb的文档 */
	var user={
		name:this.name,
		password:this.password
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//读取user集合
		db.collection('users',function(err,collection){
			if(err){
				console.log('users.collection error');
				console.log(err);
				mongodb.close();
				return callback(err);
			}
			//为name属性添加索引
			collection.ensureIndex('name',{unique:true},function(err,user){});
			//写入user文档
			collection.insert(user,{safe:true},function(err,user){
				mongodb.close();
				callback(err,user);
			});
		});
	});
};

User.get=function get(username,callback){
	mongodb.open(function(err,db){
		if(err){
			console.log('user get error');
			return callback(err);
		}
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				console.log('users collection get error');
				mongodb.close();
				return callback(err);
			}
			//查找name属性为username的文档
			collection.findOne({name:username},function(err,doc){
				mongodb.close();
				if(doc){
					//封装为User对象
					var user=new User(doc);
					callback(err,user);
				}else{
					callback(err,null);
				}
			});
		});
	});
}
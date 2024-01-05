import 'dart:async';
import 'dart:io';

import 'package:agence_fonciere/models/Construction.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:sqflite/sqflite.dart' as sql;
import 'package:agence_fonciere/models/Poi.dart';
import 'package:agence_fonciere/models/User.dart';

class SQLHelper {
  SQLHelper._privateConstructeur();
  static final SQLHelper instance = SQLHelper._privateConstructeur();
  static final _dbname = 'db.db';
  static sql.Database? _database;

  Future<sql.Database> get db async => _database ??= await _initDatabase();

  Future<sql.Database> _initDatabase() async {
    Map<Permission, PermissionStatus> statuses = await [
      Permission.location,
      Permission.storage,
    ].request();
    Directory? directory = await getExternalStorageDirectory();
    print("External storage directory path: ${directory?.path}");

    String path = "${directory?.path}/db/$_dbname";
    return sql.openDatabase(path, onCreate: _createTables, version: 5);
  }

  static Future<void> _createTables(sql.Database database, int version) async {
    //
    await database.execute(""" CREATE TABLE poi(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    type TEXT NOT NULL,
    jsonData TEXT
    )
     """);

    await database.execute('''
    CREATE TABLE users
     (id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
       password TEXT,
       role TEXT
       )
    ''');

    await database.execute(''' 
      CREATE TABLE constructions(
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        jsonData TEXT
      )
    ''');

    await database.execute(''' 
      CREATE TABLE constructionsPolygone(
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        jsonData TEXT
      )
    ''');
  }

  //CRUD User
  Future<void> createUser(User user) async {
    final sql.Database db = await instance.db;
    db.insert('users', user.toMap(),
        conflictAlgorithm: sql.ConflictAlgorithm.replace);
  }

  Future<User?> readUser(int id) async {
    final sql.Database db = await instance.db;
    List<Map<String, dynamic>> maps = await db.query('users',
        columns: ['id', 'username', 'password','role'],
        where: 'id=?',
        whereArgs: [id]);
    return await maps.isNotEmpty
        ? maps.map((u) => User.fromMap(u)).first
        : null;
  }

  Future<List<User>> readAllUsers() async {
    final sql.Database db = await instance.db;
    List<Map<String, dynamic>> maps = await db.query('users',
        columns: ['id', 'username', 'password','role'], orderBy: 'id');
    return maps.isNotEmpty ? maps.map((u) => User.fromMap(u)).toList() : [];
  }

  static Future<User?> authenticate(String _username, String _password) async {
    final sql.Database db = await instance.db;
    final users = await db.query(
      'users',
      where: 'username = ? AND password = ?',
      whereArgs: [_username, _password],
    );
    return users.isNotEmpty ? users.map((u) => User.fromMap(u)).first : null;
  }

  //pois
  Future<List<Poi>> readPois() async {
    final sql.Database db = await instance.db;
    List<Map<String, dynamic>> maps = await db.query('poi',
        columns: ['id', 'type', 'jsonData'], orderBy: 'id');
    return maps.isNotEmpty ? maps.map((u) => Poi.fromMap(u)).toList() : [];
  }

  //parcs
  Future<Poi?> readPoiByType(String type) async {
    final sql.Database db = await instance.db;
    List<Map<String, dynamic>> maps = await db.query('poi',
        columns: ['id', 'type', 'jsonData'],
        where: "type=?",
        whereArgs: [type],
        orderBy: 'id');
    return maps.isNotEmpty ? maps.map((u) => Poi.fromMap(u)).first : null;
  }

  Future<int> writePoiByType(String s, Poi parcs) async {
    final sql.Database db = await instance.db;
    return db
        .update('poi', parcs.toMap(), where: 'id=?', whereArgs: [parcs.id]);
  }

  // CRUD Construction
  Future<void> createConstruction(Construction constructions) async {
    final sql.Database db = await instance.db;
    db.insert('constructions', constructions.toMap());
  }

  Future<Construction?> readConstructions() async {
    final sql.Database db = await instance.db;
    List<Map<String, dynamic>> maps = await db.query('constructions',
        columns: ['id', 'jsonData'],
        orderBy: 'id'
       );
    return maps.isNotEmpty
        ? maps.map((c) => Construction.fromMap(c)).first
        : null;
  }

  Future<int> writeConstruction(Construction constructions) async {
    final sql.Database db = await instance.db;

      return db.update('constructions', constructions.toMap(), where: 'id=?', whereArgs: [constructions.id]);

  }

  // CRUD ConstructionPolygone
  Future<void> createConstructionPolygone(Construction constructions) async {
    final sql.Database db = await instance.db;
    db.insert('constructionsPolygone', constructions.toMap());
  }

  Future<Construction?> readConstructionsPolygone() async {
    final sql.Database db = await instance.db;
    List<Map<String, dynamic>> maps = await db.query('constructionsPolygone',
        columns: ['id', 'jsonData'],
        orderBy: 'id'
    );
    return maps.isNotEmpty
        ? maps.map((c) => Construction.fromMap(c)).first
        : null;
  }

  Future<int> writeConstructionPolygone(Construction constructions) async {
    final sql.Database db = await instance.db;

    return db.update('constructionsPolygone', constructions.toMap(), where: 'id=?', whereArgs: [constructions.id]);

  }


}

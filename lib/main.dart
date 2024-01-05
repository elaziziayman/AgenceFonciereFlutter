import 'dart:io';

import 'package:agence_fonciere/pages/homeCartographe.dart';
import 'package:flutter/material.dart';
import 'package:agence_fonciere/pages/home.dart';
import 'package:agence_fonciere/pages/login.dart';

void main() => runApp(app());

class app extends StatefulWidget {
  const app({super.key});

  @override
  State<app> createState() => _appState();
}

class _appState extends State<app> {

  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      home: Login(),
      routes: {
        '/login': (BuildContext context) => Login(),
        '/home': (BuildContext context) => Home(),
        '/homeCartographe': (context) => HomeCartographe()
      },
    );
  }
}

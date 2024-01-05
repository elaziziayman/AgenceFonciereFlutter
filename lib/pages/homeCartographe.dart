import 'dart:collection';
import 'dart:convert';

import 'package:agence_fonciere/models/Construction.dart';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

import '../helpers/sqlHelper.dart';
import '../models/Poi.dart';
import '../models/User.dart';

class HomeCartographe extends StatefulWidget {
  const HomeCartographe({Key? key}) : super(key: key);
  @override
  State<HomeCartographe> createState() => _HomeCartographeState();
}

class _HomeCartographeState extends State<HomeCartographe> {
  final GlobalKey webViewKey = GlobalKey();

  InAppWebViewController? webViewController;
  late User usr;
  late Poi? parcs, malls;
  late Construction? constructions, constructionsPolygone;

  void handleClick(int item, BuildContext context) async {
    switch (item) {
      case 0:
        var result = await webViewController?.evaluateJavascript(
            source: "alert('Menu1');");
        print(result);
        break;
      case 1:
        var result = await webViewController?.evaluateJavascript(
            source: "alert('Menu2');");
        print(result);
        break;
    }
  }

  void initData() async {
    parcs = (await SQLHelper.instance.readPoiByType("parcs"));
    malls = (await SQLHelper.instance.readPoiByType("malls"));
    constructions = (await SQLHelper.instance.readConstructions());
    constructionsPolygone = (await SQLHelper.instance.readConstructionsPolygone());

    if (constructions != null ) {
      var result = await webViewController?.evaluateJavascript(
          source: "var constructions=${json.encode(json.decode('${constructions!.jsonData}'))};"
      );
        var result3 = await webViewController?.evaluateJavascript(
            source: "init(constructions);"
        );

    } else {
      print("No constructions data found in the database");
    }
    if (constructionsPolygone != null ) {

      var result2 = await webViewController?.evaluateJavascript(
          source: "var constructionsPolygone=${json.encode(json.decode('${constructionsPolygone?.jsonData}'))};"
      );


        var result4 = await webViewController?.evaluateJavascript(
            source: "initPolygon(constructionsPolygone);"
        );

    } else {
      print("No constructionsPolygone data found in the database");
    }
  }


  @override
  Widget build(BuildContext context) {
    Map arguments = ModalRoute.of(context)?.settings.arguments as Map;
    usr = arguments['user'];
    return Scaffold(
      appBar: AppBar(
        title: Text("Espace Agent cartographe"),
        centerTitle: true,
        backgroundColor: Colors.indigo,
        actions: <Widget>[
          IconButton(
              onPressed: () async {
                initData();
              },
              icon: const Icon(Icons.refresh)),
          PopupMenuButton<int>(
            onSelected: (item) => handleClick(item, context),
            itemBuilder: (context) => [
              const PopupMenuItem<int>(value: 0, child: Text('Menu1')),
              const PopupMenuItem<int>(value: 1, child: Text('Menu2')),
            ],
          ),
        ],
      ),
      body: InAppWebView(
        initialFile: "assets/Example-leaflet-draw/index_cartographe.html",
        initialUserScripts: UnmodifiableListView<UserScript>([
          UserScript(
              source: "",
              injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START),
        ]),
        onLoadStop: (controller, url) async {
          initData();
        },
        onLoadStart: (controller, url) async {},
        onWebViewCreated: (controller) async {
          webViewController = controller;
        },
      ),
      floatingActionButton: // ...

      FloatingActionButton(
        onPressed: () async {
          // Stockez la référence au contexte avant la fonction asynchrone
          BuildContext currentContext = context;

          var result3 = await webViewController?.evaluateJavascript(
              source: "getAllData();");

          print("data to insert type: ${result3.runtimeType}, content: $result3");

        try {
            // Inside your class or function
            if (constructionsPolygone != null) {
              // If constructions is not null, update its jsonData by merging the new data.
              print("constructionsPolygone not null");

              // Update the jsonData in the Construction object
              constructionsPolygone!.jsonData = result3;

              // Update the row in the database
              await SQLHelper.instance.writeConstructionPolygone(constructionsPolygone!);
            } else {
              // If constructions is null, create a new Construction object.
              print("constructionsPolygone null, creating a new object");

              constructionsPolygone = Construction(jsonData: result3);
              await SQLHelper.instance.createConstructionPolygone(constructionsPolygone!);
            }

            // Utilisez la référence au contexte stockée
            showDialog(
              context: currentContext,
              builder: (BuildContext context) {
                return AlertDialog(
                  title: Text("Succès"),
                  content: Text("Les modifications sont sauvegardées avec succès."),
                  actions: <Widget>[
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pop(); // Ferme la boîte de dialogue
                      },
                      child: Text("OK"),
                    ),
                  ],
                );
              },
            );
          } catch (error) {
            // En cas d'erreur, utilisez également la référence au contexte stockée
            showDialog(
              context: currentContext,
              builder: (BuildContext context) {
                return AlertDialog(
                  title: Text("Erreur"),
                  content: Text("Une erreur s'est produite lors de la sauvegarde."),
                  actions: <Widget>[
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pop(); // Ferme la boîte de dialogue
                      },
                      child: Text("OK"),
                    ),
                  ],
                );
              },
            );
          }
        },
        child: Text('Save'),
        backgroundColor: Colors.blueGrey,
      ),


    );
  }
}

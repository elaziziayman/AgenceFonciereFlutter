import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class MapSuperviseur extends StatefulWidget {
  const MapSuperviseur({Key? key}) : super(key: key);

  @override
  State<MapSuperviseur> createState() => _MapSuperviseurState();
}

class _MapSuperviseurState extends State<MapSuperviseur> {
  double _progress = 0;
  late InAppWebViewController inAppWebViewController;

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        var isLastPage = await inAppWebViewController.canGoBack();

        if (isLastPage) {
          inAppWebViewController.goBack();
          return false;
        }

        return true;
      },
      child: SafeArea(
        child: Scaffold(
          body: Stack(
              children: [
          InAppWebView(
          initialUrlRequest: URLRequest(
          // Adjust this if necessary
            url: Uri.file('lib/Pages/superviseur/mapSuperviseur.html'),
      ),
      onWebViewCreated: (InAppWebViewController controller) {
        inAppWebViewController = controller;
      },
      onProgressChanged: (InAppWebViewController controller, int progress) {
        setState(() {
          _progress = progress / 100;
        });
      },
    ),
    _progress < 1
    ? Container(
    child: LinearProgressIndicator(
    value: _progress,
    ),
    )
        : SizedBox(),
    ],
    ),
    ),
    ),
    );
  }
}

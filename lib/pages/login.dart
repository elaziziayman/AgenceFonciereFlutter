import 'package:flutter/material.dart';
import 'package:agence_fonciere/helpers/sqlhelper.dart';
import 'package:agence_fonciere/models/User.dart';
import 'register.dart'; // Importation de la page d'inscription

class Login extends StatefulWidget {
  const Login({
    Key? key,
  }) : super(key: key);

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _emailController = TextEditingController();
  final _passController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.indigo, title: Text("Agence foncière"),
        centerTitle: true),
      body: ListView(
        children: [
          // Background logo
          Container(
            height: 200, // Adjust the height as needed
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/icones/logo.png'),
                fit: BoxFit.contain,
              ),
            ),
          ),
          // Login form
          Container(
            padding: EdgeInsets.all(20),
            child: Column(
              children: [
                buildUsername(),
                SizedBox(height: 20),
                buildPassword(),
                SizedBox(height: 20),
                buildLoginButton(),
                SizedBox(height: 10), // Ajout d'un espace
                buildRegisterLink(), // Ajout du lien d'inscription
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildUsername() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Nom utilisateur',
          style: TextStyle(
            color: Color(0xFF012E46),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 10),
        TextField(
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
          decoration: InputDecoration(
            prefixIcon: Icon(
              Icons.person,
              color: Color(0xFF012E46),
            ),
            hintText: 'Nom utilisateur',
          ),
        ),
      ],
    );
  }

  Widget buildPassword() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Mot de passe',
          style: TextStyle(
            color: Color(0xFF012E46),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 10),
        TextField(
          controller: _passController,
          obscureText: true,
          decoration: InputDecoration(
            prefixIcon: Icon(
              Icons.lock,
              color: Color(0xFF012E46),
            ),
            hintText: 'Mot de passe',
          ),
        ),
      ],
    );
  }

  Widget buildLoginButton() {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        padding: EdgeInsets.all(16),
        backgroundColor: Colors.cyan,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
      ),
      onPressed: () async {
        User? user = await SQLHelper.authenticate(
            _emailController.text, _passController.text);
        if (user != null) {
          if (user!.role =='Superviseur'){
            Navigator.pushNamed(context, '/home', arguments: {'user': user});


          }
          else if (user!.role =='Agent Cartographique'){
            Navigator.pushNamed(context, '/homeCartographe', arguments: {'user': user});


          }
        }
      },
      child: Text(
        'Se connecter',
        style: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget buildRegisterLink() {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => Register()), // Navigation vers la page d'inscription
        );
      },
      child: Text(
        'Pas encore inscrit ? S\'inscrire',
        style: TextStyle(
          color: Colors.blue,
          fontSize: 16,
        ),
      ),
    );
  }
}

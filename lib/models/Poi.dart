class Poi {
  int? id;
  String type;
  String jsonData;

  Poi({this.id, required this.type, required this.jsonData});

  factory Poi.fromMap(Map<String, dynamic> map) =>
      Poi(id: map['id'], type: map['type'], jsonData: map['jsonData']);

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'type': type,
      'jsonData': jsonData,
    };
  }
}

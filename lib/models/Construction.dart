class Construction {
  int? id;
  String jsonData;

  Construction({
    this.id,
    required this.jsonData,
  });

  factory Construction.fromMap(Map<String, dynamic> map) => Construction(
    id: map['id'],
    jsonData: map['jsonData'],
  );

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'jsonData': jsonData,
    };
  }
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const uniqueTodos = response.data
        .slice(0, 10)
        .reduce((acc: Todo[], todo) => {
          if (!acc.find((t) => t.id === todo.id)) {
            acc.push(todo);
          }
          return acc;
        }, []);
      setTodos(uniqueTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleToggleComplete = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id: number) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setEditingTodo(id);
      setNewTitle(todo.title);
    }
  };

  const handleSaveEdit = () => {
    if (editingTodo !== null) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editingTodo ? { ...todo, title: newTitle } : todo
        )
      );
      setEditingTodo(null);
      setNewTitle("");
    }
  };

  const handleAddTodo = () => {
    if (newTodoTitle.trim() === "") return;

    const newTodo: Todo = {
      userId: 1,
      id: Date.now(), // Using current timestamp as the unique ID
      title: newTodoTitle,
      completed: false,
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setNewTodoTitle("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>

      {/* Add Todo Input */}
      <View style={styles.addTodoContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new todo..."
          value={newTodoTitle}
          onChangeText={setNewTodoTitle}
        />
        <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            {editingTodo === item.id ? (
              <TextInput
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
              />
            ) : (
              <Text
                style={[styles.todoText, item.completed && styles.completed]}
              >
                {item.title}
              </Text>
            )}
            <View style={styles.actions}>
              {editingTodo === item.id ? (
                <TouchableOpacity onPress={handleSaveEdit}>
                  <FontAwesome
                    name="save"
                    size={20}
                    color="green"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleEditTodo(item.id)}>
                  <FontAwesome
                    name="edit"
                    size={20}
                    color="blue"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
                <FontAwesome
                  name="trash"
                  size={20}
                  color="red"
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleToggleComplete(item.id)}>
                <FontAwesome
                  name={item.completed ? "check-circle" : "circle-o"}
                  size={20}
                  color={item.completed ? "green" : "gray"}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  addTodoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
});

export default TodoApp;

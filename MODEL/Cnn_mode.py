import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import os

# Step 1: Define the SimpleCNN Class
class SimpleCNN:
    def __init__(self, input_shape, num_classes, learning_rate=0.001):
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.learning_rate = learning_rate
        
        # Initialize weights and biases
        self.weights = {
            'conv1': tf.Variable(tf.random.normal([3, 3, 3, 32], stddev=0.1)),
            'conv2': tf.Variable(tf.random.normal([3, 3, 32, 64], stddev=0.1)),
            'fc1': tf.Variable(tf.random.normal([64 * 12 * 12, 128], stddev=0.1)),  # Adjust according to output size
            'out': tf.Variable(tf.random.normal([128, num_classes], stddev=0.1))
        }
        self.biases = {
            'conv1': tf.Variable(tf.zeros([32])),
            'conv2': tf.Variable(tf.zeros([64])),
            'fc1': tf.Variable(tf.zeros([128])),
            'out': tf.Variable(tf.zeros([num_classes]))
        }

    def conv2d(self, x, W, b, strides=1):
        return tf.nn.relu(tf.nn.conv2d(x, W, strides=[1, strides, strides, 1], padding='SAME') + b)

    def maxpool2d(self, x, k=2):
        return tf.nn.max_pool2d(x, ksize=k, strides=k, padding='SAME')

    def forward(self, x):
        # Forward propagation
        conv1 = self.conv2d(x, self.weights['conv1'], self.biases['conv1'])
        pool1 = self.maxpool2d(conv1)

        conv2 = self.conv2d(pool1, self.weights['conv2'], self.biases['conv2'])
        pool2 = self.maxpool2d(conv2)

        flatten = tf.reshape(pool2, [-1, np.prod(pool2.shape[1:])])  # Flatten
        fc1 = tf.nn.relu(tf.matmul(flatten, self.weights['fc1']) + self.biases['fc1'])
        out = tf.matmul(fc1, self.weights['out']) + self.biases['out']
        
        return out

    def compute_loss(self, logits, labels):
        return tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits=logits, labels=labels))

    def backward(self, x, y, logits):
        with tf.GradientTape() as tape:
            loss = self.compute_loss(logits, y)
        gradients = tape.gradient(loss, list(self.weights.values()) + list(self.biases.values()))
        
        for i, (w, b) in enumerate(zip(self.weights.values(), self.biases.values())):
            w.assign_sub(self.learning_rate * gradients[i])
            b.assign_sub(self.learning_rate * gradients[len(self.weights) + i])
        
        return loss

# Step 2: Data Preparation
def preprocess_data(df, base_dir, label_mapping):
    images = []
    labels = []
    for idx, row in df.iterrows():
        img_path = os.path.join(base_dir, row['pth'])
        img = load_img(img_path, target_size=(48, 48))
        img_array = img_to_array(img) / 255.0  # Normalize
        images.append(img_array)
        
        # Convert label to one-hot encoding
        label = row['label']
        one_hot = np.zeros(len(label_mapping))
        one_hot[label_mapping[label]] = 1
        labels.append(one_hot)
        
    return np.array(images), np.array(labels)

# Step 3: Training Function
def train(model, train_data, train_labels, epochs=10):
    for epoch in range(epochs):
        for i in range(len(train_data)):
            x = train_data[i]
            y = train_labels[i]
            x = np.expand_dims(x, axis=0)  # Add batch dimension

            # Forward pass
            logits = model.forward(x)

            # Backward pass
            loss = model.backward(x, y, logits)

        print(f'Epoch {epoch + 1}/{epochs}, Loss: {loss.numpy()}')

# Step 4: Load the Labels
import kagglehub
import os

# Download latest version
base_dir = kagglehub.dataset_download("noamsegal/affectnet-training-data")
print("Path to dataset files:", base_dir)
labels_df = pd.read_csv(os.path.join(base_dir, 'labels.csv'))

# Create a mapping for labels
label_mapping = {label: idx for idx, label in enumerate(labels_df['label'].unique())}

# Preprocess data
train_data, train_labels = preprocess_data(labels_df, base_dir, label_mapping)

# Step 5: Instantiate and Train the Model
model = SimpleCNN(input_shape=(48, 48, 3), num_classes=len(label_mapping))
train(model, train_data, train_labels, epochs=10)

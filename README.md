# ECG Viewer Application

## Overview
The ECG Viewer is a React-based web application that allows users to visualize and analyze ECG data. It supports various functionalities including filtering annotations, selecting and labeling beats, viewing ECG waveforms, and generating Lorenz plots. This application allows users to inspect and manipulate ECG data, and analyze heart rhythms in real-time.

## Features
- **ECG Chart Visualization**: Displays ECG data as a chart, with markers for annotations and the ability to zoom and pan through the signal.
- **Filters**: Provides filters to select specific beats based on index, labels, and time range.
- **Annotations**: View and modify annotations for beats, with options to label and select specific beats.
- **Lorenz Plot**: Display Lorenz plot based on RR intervals derived from ECG data, used to visualize heart rate variability.
- **Event Panel**: Displays and manages beats, allowing the user to toggle selection, change labels, and apply batch updates.
- **Selection Panel**: Allows users to select beats for analysis and view details.

## Project Structure
- **src/**: Contains the source code for the application.
- **components/**: Contains the components that handle rendering the ECG data, filters, annotations, and more.
- **hooks/**: Custom hooks like `useEcgData` for fetching and managing ECG data.
- **context/**: Context provider for managing and sharing highlighted information across components.
- **types/**: Defines types for ECG data and annotations.
- **utils/**: Utility functions for ECG processing, including RR interval calculation and heart rate estimation.

## Installation
To run the project locally, follow these steps:

### Prerequisites
Ensure you have the following installed:
- **Node.js**
- **npm**

### Steps
1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```bash
    cd ecg-viewer
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Run the application:
    ```bash
    npm start
    ```
    This will start a development server and open the application in your default web browser. The application should now be accessible at `http://localhost:3000`.

## Components

### App
The main component that handles state management and rendering of all other components. It integrates all the functionality such as filtering beats, viewing ECG charts, handling events, and displaying Lorenz plots.

### FiltersBeats
A component for managing the filters. Users can filter beats based on labels, indices, and time ranges. The component provides checkboxes for each filter and allows toggling all tags at once.

### EcgChart
The ECG chart visualizes the ECG data over time. It provides functionality for selecting a range of data (with a zoom feature) and displays annotations over the ECG signal. It also shows the heart rate information when a range is selected.

### EventsPanel
Displays all annotations for the ECG beats, with options for toggling selections, changing labels, and selecting a subset of beats to display. The panel also provides batch operations for updating multiple annotations at once.

### LorenzPlot
Generates a Lorenz plot based on RR intervals calculated from the ECG beats. The plot is helpful for visualizing the distribution of heart rate variability.

### SelectionPanel
A simple panel for managing the selected beats and analyzing the selected data.

## Data Format
The application uses ECG data formatted as follows:

```typescript
interface EcgGraphDTO {
  signals: EcgSignal[];
}

interface EcgSignal {
  timeInMs: number;
  point: number;
}

interface AnnotationDTO {
  beatIndex: number;
  label: string;
  rPeak: number;
}

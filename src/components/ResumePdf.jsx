import React from 'react';
import "../App.css";
import { Page, Text, View, Document, StyleSheet, Link, Font } from '@react-pdf/renderer';

// --- Stylesheet ---
// All Tailwind CSS classes have been converted to this StyleSheet object.
// This is the standard way to apply styles in @react-pdf/renderer.
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
  },
  link: {
    fontSize: 3,
    color: 'black',
    textDecoration: 'none',
  },
  section: {
    paddingHorizontal: 8,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 8,
  },
  item: {
    marginBottom: 8,
  },
  itemHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 11,
  },
  itemSubHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  text: {
    fontSize: 10,
  },
  technologies: {
    fontStyle: 'italic',
    fontSize: 9,
    color: '#555555',
  },
  listItem: {
    fontSize: 10,
    marginLeft: 10, // Indent list items
  }
});

// --- The PDF Document Component ---
export const ResumePDF = ({ formData }) => {
  // Correctly check if experience data exists without causing re-renders
  const hasExperience = formData.experience && formData.experience.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{formData.name}</Text>
            <View style={styles.contactInfo}>
              <Link style={styles.link} src={`mailto:${formData.email}`}>{formData.email}</Link>
              <Text>|</Text>
              <Link style={styles.link} src={`tel:${formData.phone}`}>{formData.phone}</Link>
              <Text>|</Text>
              <Link style={styles.link} src={formData.linkedIn}>LinkedIn</Link>
              <Text>|</Text>
              <Link style={styles.link} src={formData.github}>GitHub</Link>
            </View>
          </View>

          {/* Education */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.divider} />
            {formData.education.map((edu, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.title}>{edu.institution}</Text>
                  <Text style={styles.text}>{edu.year}</Text>
                </View>
                <View style={styles.itemSubHeader}>
                  <Text style={styles.text}>{edu.degree}</Text>
                  <Text style={styles.text}>CGPA: {edu.cgpa}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Projects */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <View style={styles.divider} />
            {formData.projects.map((project, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.title}>{project.title}</Text>
                <Text style={styles.text}>{project.description}</Text>
                <Text style={styles.technologies}>Technologies: {project.technologies.join(", ")}</Text>
                <Link style={styles.link} src={project.link}>Project Link</Link>
              </View>
            ))}
          </View>

          {/* Experience (conditionally rendered) */}
          {hasExperience && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              <View style={styles.divider} />
              {formData.experience.map((exp, index) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.title}>{exp.company}</Text>
                  <Text style={styles.text}>{exp.role}</Text>
                  <Text style={styles.text}>{exp.duration}</Text>
                  {exp.responsibilities.map((resp, i) => (
                    // Simulating a list item with a bullet point
                    <Text key={i} style={styles.listItem}>• {resp}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};